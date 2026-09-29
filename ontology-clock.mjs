// Leaf-free ontology, with annotations arranged around the two streams.
export function ontologyClockSvg(){
 const cx=650,cy=650;
 const text=(x,y,s,size=22,extra='')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" ${extra}>${s}</text>`;
 const italic=(x,y,s,size=20)=>text(x,y,s,size,'font-style="italic"');
 const pt=(r,a)=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)];
 const arc=(r,a,b,outer)=>`<path d="M ${pt(r,a)} A ${r} ${r} 0 0 ${b>a?1:0} ${pt(r,b)}" fill="none" stroke="${outer?'#555':'#111'}" stroke-width="2" ${outer?'stroke-dasharray="7 5"':''} marker-end="url(#clock-arrow)"/>`;
 let b=`<defs><marker id="clock-arrow" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="7" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 4 L0 8Z" fill="#333"/></marker></defs>`;
 b+=`<path d="M650 220 V1190 M140 650 H1180" fill="none" stroke="#555" stroke-width="1.7" marker-start="url(#clock-arrow)" marker-end="url(#clock-arrow)"/>`;
 b+=text(650,95,'INTENSITY [DEGREE]',30)+italic(650,137,'Synthetic Axis',28)+text(650,204,'Expansion [+]',22)+text(650,1235,'Contraction [−]',22);
 b+=text(1390,565,'POLARITY [FORCES]',29)+italic(1390,607,'Analytic Axis',27);
 b+=text(110,623,'Expansion [+]',20)+text(105,686,'LIGHT',20)+text(1220,623,'Contraction [−]',20)+text(1220,686,'DARK',20);
 for(let i=0;i<2;i++){
  b+=arc(270,-88+i*180,88+i*180,false);
  b+=arc(310,88-i*180,-88-i*180,true);
 }
 for(const [x,y,name,sub] of [[270,408,'Segmenting','complex expansion'],[1025,408,'Spreading','complex contraction'],[270,900,'Shooting','simple expansion'],[1025,900,'Stemming','simple contraction']])b+=text(x,y,name,28,'font-weight="600"')+italic(x,y+31,`[${sub}]`,19);
 b+=text(545,310,'Most Expanded',20)+text(775,310,'Least Contracted',20)+text(530,1000,'Least Expanded',20)+text(795,1000,'Most Contracted',20);
 for(const y of [340,960])b+=`<circle cx="650" cy="${y}" r="5" fill="white" stroke="#333" stroke-width="1.5"/>`;
 b+=italic(760,942,'inversion',18);
 b+=`<g fill="#777">${italic(705,424,'separating',20)}${italic(462,622,'interpenetrating',20)}${italic(840,691,'merging',20)}</g>`;
 b+=`<path d="M1118 345 h12 v285 h-12 M1118 670 h12 v285 h-12 M340 1050 v12 h285 v-12 M675 1050 v12 h285 v-12" fill="none" stroke="#777" stroke-width="1.2"/>`;
 b+=italic(1235,490,'Complex Forms',20)+italic(1235,830,'Simple Forms',20)+italic(485,1100,'Concave, Pointy Forms',20)+italic(820,1100,'Convex, Rounded Forms',20);
 b+=`<rect x="1020" y="75" width="560" height="165" fill="none" stroke="#aaa"/><path d="M1050 123 H1130" stroke="#111" stroke-width="2" marker-end="url(#clock-arrow)"/><path d="M1130 192 H1050" stroke="#555" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#clock-arrow)"/>`;
 b+=italic(1340,118,'Growth of individual leaves',21)+text(1340,147,'Embryogenesis · inner clockwise',19)+italic(1340,187,'Changes in the mature leaf series',21)+text(1340,217,'Ontogenesis · outer counter-clockwise',19);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1640" height="1290" viewBox="0 0 1640 1290" aria-label="Ontology of formative activities"><rect width="1640" height="1290" fill="white"/><g fill="#111" font-family="Garamond, serif">${b}</g></svg>`;
}
