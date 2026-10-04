import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export function summarize(days, today) {
  const ordered = days.filter(d => d.date <= today).sort((a,b) => a.date.localeCompare(b.date));
  let best = 0, run = 0;
  for (const d of ordered) { run = d.contributionCount > 0 ? run + 1 : 0; best = Math.max(best, run); }
  let end = ordered.length - 1;
  if (ordered[end]?.date === today && ordered[end].contributionCount === 0) end--;
  let current = 0;
  for (let i=end; i>=0 && ordered[i].contributionCount > 0; i--) current++;
  const recent = ordered.slice(-28);
  return { total: ordered.reduce((s,d)=>s+d.contributionCount,0), active: ordered.filter(d=>d.contributionCount>0).length,
    current, best, recent: recent.reduce((s,d)=>s+d.contributionCount,0), days: ordered.length };
}
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const txt = (x,y,value,size=18,color='#a3a4ae',extra='') => '<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" '+extra+'>'+escape(value)+'</text>';
const wrap = (title,body) => '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" role="img"><title>'+escape(title)+'</title><rect width="640" height="400" fill="#0d1117"/><g font-family="Georgia,serif">'+body+'</g></svg>';
export function render(summary, collection, login, today) {
  let grid=txt(32,44,'The ledger',28,'#e5dfd2')+txt(32,72,login+' · rolling year',14)+
    '<path d="M32 92H608" stroke="#454446"/>';
  const entries=[['Contributions',summary.total],['Active days',summary.active],['Current streak',summary.current+'d'],['Best in window',summary.best+'d'],['Last 28 days',summary.recent],['Days in window',summary.days]];
  entries.forEach(([label,value],i)=>{const x=32+(i%2)*308,y=132+Math.floor(i/2)*80;grid+=txt(x,y,label,16)+txt(x,y+34,value,30,'#c1b49d');});
  grid+=txt(32,382,'Updated '+today+' UTC · GitHub contribution calendar',12);
  const categories=[['Commits',collection.totalCommitContributions,320,98],['Pull requests',collection.totalPullRequestContributions,520,208],['Reviews',collection.totalPullRequestReviewContributions,320,310],['Issues',collection.totalIssueContributions,120,208]];
  let orbit=txt(32,44,'The contribution orbit',28,'#e5dfd2')+
    '<g fill="none" stroke="#57505a"><ellipse cx="320" cy="205" rx="200" ry="108"/><ellipse cx="320" cy="205" rx="104" ry="132"/><path d="M320 80V330M105 205H535" stroke="#282d38"/></g>'+
    '<circle cx="320" cy="205" r="55" fill="#171b23" stroke="#975757"/>'+
    txt(320,198,'ASH & IRON',17,'#e5dfd2','text-anchor="middle"')+
    txt(320,223,'Contributions',12,'#a3a4ae','text-anchor="middle"');
  categories.forEach(([name,value,x,y])=>{orbit+='<rect x="'+(x-72)+'" y="'+(y-29)+'" width="144" height="57" rx="4" fill="#0d1117"/>'+txt(x,y-6,value,24,'#c1b49d','text-anchor="middle"')+txt(x,y+17,name,14,'#a3a4ae','text-anchor="middle"');});
  orbit+=txt(32,382,'Visible activity by type · rolling year · '+today+' UTC',12);
  return {'analytics-grid.svg':wrap('Contribution ledger',grid),'contribution-orbit.svg':wrap('Contribution orbit',orbit)};
}
async function main() {
  const login=process.env.PROFILE_USERNAME || '0x496C6B696E';
  if(!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required. Run this script through the supplied GitHub Actions workflow.');
  const query='query($login:String!){user(login:$login){contributionsCollection{totalCommitContributions totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}';
  const res=await fetch('https://api.github.com/graphql',{method:'POST',headers:{Authorization:'Bearer '+process.env.GITHUB_TOKEN,'Content-Type':'application/json','User-Agent':'ash-and-iron-profile'},body:JSON.stringify({query,variables:{login}}),signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error('GitHub API HTTP '+res.status);
  const payload=await res.json();
  if(payload.errors || !payload.data?.user) throw new Error('GitHub contribution query failed; no output was generated.');
  const c=payload.data.user.contributionsCollection;
  const days=c.contributionCalendar.weeks.flatMap(w=>w.contributionDays);
  if(!days.length) throw new Error('Empty contribution calendar; refusing to display fabricated zeros.');
  const today=new Date().toISOString().slice(0,10);
  const svgs=render(summarize(days,today),c,login,today);
  const destination=process.env.PROFILE_OUTPUT_DIR || 'dist';
  await mkdir(destination,{recursive:true});
  for(const [name,svg] of Object.entries(svgs)) await writeFile(destination+'/'+name,svg);
  console.log('Generated contribution ledger and orbit from GitHub data.');
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main().catch(e=>{console.error(e.message);process.exitCode=1;});

