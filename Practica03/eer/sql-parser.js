/* Lightweight MySQL dump parser. It reads SQL text only; it never executes it. */
const unquote = s => s?.replace(/^`|`$/g, '').replace(/``/g, '`');

export function lexSQL(sql) {
  const out = []; let i = 0;
  while (i < sql.length) {
    const c = sql[i], n = sql[i + 1];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '-' && n === '-' && (!sql[i + 2] || /\s/.test(sql[i + 2]))) { i += 2; while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === '#') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') { const end = sql.indexOf('*/', i + 2); i = end < 0 ? sql.length : end + 2; continue; }
    if (c === '`' || c === "'" || c === '"') {
      const q = c; let raw = c, value = ''; i++;
      while (i < sql.length) {
        const x = sql[i++]; raw += x;
        if (x === '\\' && q !== '`' && i < sql.length) { value += sql[i]; raw += sql[i++]; continue; }
        if (x === q) { if (sql[i] === q) { raw += sql[i++]; value += q; continue; } break; }
        value += x;
      }
      out.push({ type: q === '`' ? 'id' : 'str', value: q === '`' ? value : value, raw }); continue;
    }
    if (/[A-Za-z_$\u0080-\uffff]/.test(c)) { let j = i + 1; while (j < sql.length && /[\w$\u0080-\uffff]/.test(sql[j])) j++; out.push({ type:'word', value:sql.slice(i,j), raw:sql.slice(i,j) }); i=j; continue; }
    if (/\d/.test(c)) { let j=i+1; while(j<sql.length && /[\w.]/.test(sql[j])) j++; out.push({type:'num',value:sql.slice(i,j),raw:sql.slice(i,j)}); i=j; continue; }
    out.push({ type:'sym', value:c, raw:c }); i++;
  }
  return out;
}

function statements(sql) {
  const result=[]; let delimiter=';', start=0, quote='', lineStart=0;
  // Split by MySQL client DELIMITER directives while preserving quoted strings/comments.
  const lines=sql.split(/(?<=\n)/); let buf='';
  for (const line of lines) {
    const m=line.trim().match(/^DELIMITER\s+(\S+)/i);
    if (m) { if (buf.trim()) result.push(buf.trim()); buf=''; delimiter=m[1]; continue; }
    buf += line;
    let i=0, chunk=0, q='';
    while(i<buf.length) {
      const c=buf[i], n=buf[i+1];
      if(q) { if(c==='\\' && q!== '`') {i+=2;continue;} if(c===q) {if(buf[i+1]===q){i+=2;continue;} q='';} i++;continue; }
      if(c==='`'||c==="'"||c==='"'){q=c;i++;continue;}
      if(c==='-'&&n==='-'&&(!buf[i+2]||/\s/.test(buf[i+2]))){const e=buf.indexOf('\n',i); i=e<0?buf.length:e+1;continue;}
      if(c==='#'){const e=buf.indexOf('\n',i);i=e<0?buf.length:e+1;continue;}
      if(c==='/'&&n==='*'){const e=buf.indexOf('*/',i+2);i=e<0?buf.length:e+2;continue;}
      if(buf.startsWith(delimiter,i)){const s=buf.slice(chunk,i).trim();if(s)result.push(s);i+=delimiter.length;chunk=i;continue;}
      i++;
    }
    buf=buf.slice(chunk);
  }
  if(buf.trim()) result.push(buf.trim());
  return result;
}
const val = t => t?.value ?? '';
const upper = t => val(t).toUpperCase();
function splitTop(tokens, delimiter=',') { const a=[];let cur=[],d=0; for(const t of tokens){if(t.value==='(')d++;if(t.value===')')d--;if(t.value===delimiter&&d===0){a.push(cur);cur=[];}else cur.push(t);} if(cur.length)a.push(cur); return a; }
function parenEnd(ts,start){let d=0;for(let i=start;i<ts.length;i++){if(ts[i].value==='(')d++;else if(ts[i].value===')'&&--d===0)return i;}return -1;}
function parseExpr(ts) { let s='',prev=null; for(const t of ts){const word=t.type==='word'||t.type==='num'||t.type==='id';if(s&&word&&prev&&(prev.type==='word'||prev.type==='num'||prev.type==='id'||prev.type==='str'))s+=' ';s+=t.raw;prev=t;}return s; }
function parseTable(stmt, schema) {
  const t=lexSQL(stmt); let p=t.findIndex(x=>upper(x)==='TABLE'); if(p<0)return null; p++; if(upper(t[p])==='IF')p+=3;
  let name=unquote(val(t[p++])); if(t[p]?.value==='.') name=unquote(val(t[++p]));
  const open=t.findIndex((x,i)=>i>=p&&x.value==='('); if(open<0)return null; const end=parenEnd(t,open); if(end<0)return null;
  const table={name,columns:[],primaryKey:[],foreignKeys:[],indexes:[],checks:[],engine:null,options:stmt.slice(stmt.indexOf(')')+1).trim()};
  for(const part of splitTop(t.slice(open+1,end))){ if(!part.length)continue; let i=0, first=upper(part[0]);
    if(['PRIMARY','UNIQUE','KEY','INDEX','CONSTRAINT','FOREIGN','CHECK'].includes(first)){
      let constraint=null; if(first==='CONSTRAINT'){constraint=unquote(val(part[1]));i=2;first=upper(part[i]);}
      if(first==='PRIMARY'){const op=part.findIndex(x=>x.value==='('),e=parenEnd(part,op);table.primaryKey=splitTop(part.slice(op+1,e)).map(x=>unquote(val(x[0])));}
      else if(first==='FOREIGN'){let op=part.findIndex(x=>upper(x)==='KEY');op=part.findIndex((x,j)=>j>op&&x.value==='(');const e=parenEnd(part,op);const cols=splitTop(part.slice(op+1,e)).map(x=>unquote(val(x[0])));let r=part.findIndex((x,j)=>j>e&&upper(x)==='REFERENCES');let ri=r+1;let refTable=unquote(val(part[ri++]));if(part[ri]?.value==='.')refTable=unquote(val(part[++ri]));const ro=part.findIndex((x,j)=>j>r&&x.value==='('),re=parenEnd(part,ro);const refCols=splitTop(part.slice(ro+1,re)).map(x=>unquote(val(x[0])));table.foreignKeys.push({name:constraint,columns:cols,referencedTable:refTable,referencedColumns:refCols,onDelete:action(part,'DELETE'),onUpdate:action(part,'UPDATE')});}
      else if(first==='UNIQUE'||first==='KEY'||first==='INDEX'){const type=first==='UNIQUE'?'UNIQUE':'INDEX';const op=part.findIndex(x=>x.value==='('),e=parenEnd(part,op);const ixName=unquote(val(part[op-1]));table.indexes.push({name:constraint||ixName,type,columns:splitTop(part.slice(op+1,e)).map(x=>unquote(val(x[0])))});}
      else if(first==='CHECK'){const op=part.findIndex(x=>x.value==='('),e=parenEnd(part,op);table.checks.push({name:constraint,expression:parseExpr(part.slice(op+1,e))});}
      continue;
    }
    const col={name:unquote(val(part[0])),ordinal:table.columns.length+1}; let j=1,depth=0;
    for(;j<part.length;j++){if(part[j].value==='(')depth++;if(part[j].value===')')depth--;if(depth===0&&['NOT','NULL','DEFAULT','AUTO_INCREMENT','COMMENT','COLLATE','CHARACTER','GENERATED','AS','ON','UNIQUE','PRIMARY','REFERENCES','CHECK'].includes(upper(part[j])))break;}
    col.type=parseExpr(part.slice(1,j)); col.nullable=true; col.attributes=[];
    for(let k=j;k<part.length;k++){const w=upper(part[k]);if(w==='NOT'&&upper(part[k+1])==='NULL'){col.nullable=false;k++;}else if(w==='NULL')col.nullable=true;else if(w==='DEFAULT'){let e=k+1;if(part[e]?.value==='('){e=parenEnd(part,e)+1;}else if(['+','-'].includes(part[e]?.value))e+=2;else if(['B','X','_BINARY'].includes(upper(part[e]))&&part[e+1]?.type==='str')e+=2;else e++;col.default=parseExpr(part.slice(k+1,e));k=e-1;}else if(w==='AUTO_INCREMENT')col.autoIncrement=true;else if(w==='COMMENT')col.comment=val(part[++k]);else if(w==='ON'&&upper(part[k+1])==='UPDATE'){let e=k+2;while(e<part.length&&!['NOT','NULL','DEFAULT','COMMENT','COLLATE'].includes(upper(part[e])))e++;col.onUpdate=parseExpr(part.slice(k+2,e));k=e-1;}else if(w==='GENERATED'||w==='AS'){col.generated=parseExpr(part.slice(k));break;}else if(w==='UNIQUE'){col.unique=true;let nm=upper(part[k+1])==='KEY'?val(part[k+2]):null;table.indexes.push({name:nm||col.name,type:'UNIQUE',columns:[col.name]});}else if(w==='PRIMARY'&&upper(part[k+1])==='KEY')table.primaryKey=[col.name];else if(w==='CHECK'){const op=part.findIndex((x,z)=>z>k&&x.value==='('),e=parenEnd(part,op);table.checks.push({name:null,expression:parseExpr(part.slice(op+1,e))});k=e;}else if(w==='UNSIGNED'||w==='ZEROFILL'||w==='BINARY')col.attributes.push(val(part[k]));}
    const ref=part.findIndex(x=>upper(x)==='REFERENCES');if(ref>=0){let rt=unquote(val(part[ref+1])),ri=ref+2;if(part[ri]?.value==='.')ri++;if(ri!==ref+2)rt=unquote(val(part[ri]));const o=part.findIndex((x,k)=>k>ri&&x.value==='('),e=parenEnd(part,o);col.inlineReference={table:rt,column:unquote(val(part[o+1]))};}
    table.columns.push(col);
  }
  for(const c of table.columns) if(c.inlineReference)table.foreignKeys.push({columns:[c.name],referencedTable:c.inlineReference.table,referencedColumns:[c.inlineReference.column]});
  table.engine=(stmt.match(/\bENGINE\s*=\s*([\w]+)/i)||[])[1]||null;
  return table;
}
function action(ts,what){const i=ts.findIndex((x,j)=>upper(x)==='ON'&&upper(ts[j+1])===what);return i<0?null:val(ts.slice(i+2).find(x=>['CASCADE','RESTRICT','SET','NO'].includes(upper(x))))+(upper(ts[i+3])==='NULL'?' NULL':'');}

export function analyzeDump(sql) {
  // MySQL executable comments carry versioned DDL (notably trigger definitions).
  sql = sql.replace(/\/\*!\d*\s*([\s\S]*?)\*\//g, '$1');
  const dbs=[...sql.matchAll(/\bCREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?`([^`]+)`/ig)].map(m=>m[1]);
  const uses=[...sql.matchAll(/\bUSE\s+`?([\w$-]+)`?\s*;/ig)].map(m=>m[1]);
  const tables=new Map(), inserts={}, objects={views:[],triggers:[],procedures:[],functions:[]}; let statementCount=0,unsupported=[];
  for(const stmt of statements(sql)){statementCount++;const t=lexSQL(stmt);if(!t.length)continue;const words=t.slice(0,7).map(upper);
    if(words.includes('TABLE')&&words.includes('CREATE')){const tb=parseTable(stmt);if(tb)tables.set(tb.name,tb);continue;}
    if(words[0]==='INSERT'||words[0]==='REPLACE'){
      let i=1;if(upper(t[i])==='INTO')i++;const table=unquote(val(t[i++]));if(t[i]?.value==='.')i++;let cols=null;if(t[i]?.value==='('){const e=parenEnd(t,i);if(e>i&&upper(t[e+1])==='VALUES'){cols=splitTop(t.slice(i+1,e)).map(x=>unquote(val(x[0])));i=e+1;}}
      const vi=t.findIndex((x,j)=>j>=i&&upper(x)==='VALUES');if(vi>=0){const rows=[];for(let p=vi+1;p<t.length;p++){if(t[p].value==='('){const e=parenEnd(t,p);if(e>p){rows.push(t.slice(p+1,e));p=e;}}}inserts[table]=(inserts[table]||0)+rows.length;}else inserts[table]=null;continue;
    }
    if(words[0]==='CREATE'){
      const kind=words.find(x=>['VIEW','TRIGGER','PROCEDURE','FUNCTION'].includes(x));if(kind){const name=t.find((x,j)=>j>0&&['VIEW','TRIGGER','PROCEDURE','FUNCTION'].includes(upper(t[j-1])));const v=unquote(val(name));const key={VIEW:'views',TRIGGER:'triggers',PROCEDURE:'procedures',FUNCTION:'functions'}[kind];objects[key].push(v);continue;}
    }
    if(['UPDATE','DELETE','REPLACE'].includes(words[0]))unsupported.push(words[0]);
  }
  // Later ALTER TABLE clauses extend table definitions.
  for(const stmt of statements(sql)){const t=lexSQL(stmt);if(upper(t[0])!=='ALTER'||upper(t[1])!=='TABLE')continue;const tn=unquote(val(t[2])),tb=tables.get(tn);if(!tb)continue;const ai=t.findIndex(x=>upper(x)==='ADD');if(ai<0)continue;let part=t.slice(ai+1);if(upper(part[0])==='CONSTRAINT'){const fake='CREATE TABLE `x` ('+part.map(x=>x.raw).join(' ')+')';const p=parseTable(fake);if(p){tb.foreignKeys.push(...p.foreignKeys);tb.indexes.push(...p.indexes);tb.checks.push(...p.checks);if(p.primaryKey.length)tb.primaryKey=p.primaryKey;}}}
  const relations=[];
  for(const tb of tables.values()){
    tb.primaryKey.forEach(c=>{const col=tb.columns.find(x=>x.name===c);if(col)col.primaryKey=true;});
    for(const ix of tb.indexes)for(const c of ix.columns){const col=tb.columns.find(x=>x.name===c);if(col)(col.indexes??=[]).push(ix.name);if(ix.type==='UNIQUE'&&col)col.unique=true;}
    for(const fk of tb.foreignKeys){fk.columns.forEach((c,i)=>{const col=tb.columns.find(x=>x.name===c);if(col)(col.foreignKeys??=[]).push({name:fk.name||null,table:fk.referencedTable,column:fk.referencedColumns[i],onDelete:fk.onDelete,onUpdate:fk.onUpdate});});const target=tables.get(fk.referencedTable);const unique=tb.primaryKey.join('|')===fk.columns.join('|')||tb.indexes.some(ix=>ix.type==='UNIQUE'&&ix.columns.join('|')===fk.columns.join('|'));relations.push({source:tb.name,sourceColumns:fk.columns,target:fk.referencedTable,targetColumns:fk.referencedColumns,name:fk.name||null,kind:'declared',cardinality:unique?'1:1':'1:N',self:tb.name===fk.referencedTable,warning:!target?`La tabla referenciada ${fk.referencedTable} no aparece en el respaldo.`:null});}
  }
  for(const tb of tables.values())tb.rowCount=Object.hasOwn(inserts,tb.name)?inserts[tb.name]:0;
  const association=t=>t.foreignKeys.length>=2&&t.foreignKeys.every(f=>f.columns.every(c=>t.primaryKey.includes(c)));
  const manyToMany=[];
  for(const t of tables.values())if(association(t)){const f=t.foreignKeys;if(f.length===2&&f[0].referencedTable!==f[1].referencedTable)manyToMany.push({table:t.name,leftTable:f[0].referencedTable,leftColumns:f[0].referencedColumns,rightTable:f[1].referencedTable,rightColumns:f[1].referencedColumns});}
  const dataMutations=[];
  for(const m of sql.matchAll(/\bUPDATE\s+`?([\w$]+)`?\s+(?=SET\b)/ig))dataMutations.push({operation:'UPDATE',table:m[1]});
  for(const m of sql.matchAll(/\bDELETE\s+FROM\s+`?([\w$]+)`?/ig))dataMutations.push({operation:'DELETE',table:m[1]});
  for(const m of sql.matchAll(/\bREPLACE\s+INTO\s+`?([\w$]+)`?/ig))dataMutations.push({operation:'REPLACE',table:m[1]});
  // Indexes outside table declarations (including ALTER ADD KEY) are reflected in column metadata above.
  return {database:{target:'db_test_8b',declared:[...new Set([...dbs,...uses])]},source:'respaldo_1410.sql',tables:[...tables.values()],relations,manyToMany,objects,inserts,dataMutations,unsupportedStatements:[...new Set(unsupported)],statementCount,associationTables:[...tables.values()].filter(association).map(t=>t.name),associationCandidates:[...tables.values()].filter(t=>t.foreignKeys.length>=2).map(t=>({table:t.name,confirmed:association(t)})),warnings:['Conteos de INSERT representan filas incluidas en el respaldo, no registros actuales ni estado final.','El respaldo contiene definiciones de rutinas almacenadas; no se ejecutaron.']};
}
