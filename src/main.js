import { firebaseWebConfig } from './firebase-config.js';

const firebaseConfig = firebaseWebConfig;
const configured = Object.values(firebaseConfig).every(Boolean);
let db = null;
let firestore = null;

// 관리자 비밀번호 (원하시는 비밀번호로 변경하세요)
const ADMIN_PASSWORD = '1234';

async function connectFirebase() {
  if (db) return true;
  if (!configured) return false;
  const [{ initializeApp }, api] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'),
  ]);
  firestore = api; 
  db = api.getFirestore(initializeApp(firebaseConfig));
  return true;
}

const app = document.querySelector('#app');
const cohorts = ['1기', '2기', '3기', '4기', '5기'];
const topics = ['해양 환경/생태계', '해양 물류/항만', '해양 관광/레저', '수산업'];
const questions = [
  '친구들과 모둠 과제나 여행 계획을 짤 때, 아이디어가 너무 많아지면 “우선 이것부터 확실히 하자”며 정리해 본 적이 있다.',
  '약속 시간이나 마감 기한을 잘 지키며, 친구들과 일할 때 “우리 몇 시까지 이거 끝내야 해”라고 시간을 챙기는 편이다.',
  '모둠 활동 중 친구들 사이에 의견이 갈려 조율이 필요할 때, 중간에서 감정 없이 깔끔하게 결론을 내본 경험이 있다.',
  '수업 시간이나 동아리 활동 때 중요한 내용이나 진행 상황을 종이 노트에 예쁘고 알기 쉽게 정돈하는 편이다.',
  '준비했던 계획이 갑자기 틀어져도 당황하지 않고 빠르게 다음 대안(Plan B)을 떠올린다.',
  '수행평가 발표 자료나 포스터를 만드는 것을 좋아하는 편이다.',
  '내가 머릿속으로 생각한 느낌이나 구조를 친구들에게 말이나 간단한 그림으로 이해하기 쉽게 잘 설명한다.',
  '평소 자주 쓰는 앱을 보며 “버튼이 여기 있어서 편하네” 혹은 “이 배치는 좀 불편하다”는 생각을 해본 적이 있다.',
  '미술이나 만들기를 할 때 원래 원했던 디자인이 어렵거나 재료가 부족하면, 빠르게 현실적인 디자인으로 고쳐 쓸 수 있다.',
  'PPT나 문서를 만들 때 폰트 종류, 글자 크기, 여백, 색상 조합 등 세밀한 디테일에 꽤 예민하고 세심하다.',
  '프로그래밍 언어로 간단한 코드를 작성해 보았거나, AI가 출력한 코드에서 변수나 데이터 위치를 찾아 고칠 수 있다.',
  'AI 서비스(ChatGPT 등)를 다루는 데 익숙하고, 컴퓨터 활용 능력이 또래보다 뛰어난 편이다.',
  '조원들이 말로 불러주는 아이디어나 스케치 내용을 빠르게 노트북 타자로 치며 AI와 소통할 수 있다.',
  '원하는 결과나 오류 해결이 한 번에 안 나와도 조건을 바꿔가며 AI와 계속 대화할 끈기가 있다.',
  '타자치는 속도가 빠른 편이다.',
  '어플이나 물건을 사용할 때 남들이 생각지 못한 엉뚱한 행동을 잘 하는 편이다.',
  '새로운 앱이나 게임이 나오면 이것저것 다 눌러보며 구석구석 기능을 사용해 보는 편이다.',
  '무언가 잘못되었을 때 “뭐가 문제인지”를 상대방이 알아듣기 쉽게 구체적으로 설명하는 편이다.',
  '반 학생들이나 사람들 앞에서 발표할 때 크게 떨지 않고 준비한 내용을 재미있고 자신 있게 전달할 수 있다.',
  '친구들에게 재미있는 경험담이나 이야기를 유쾌하고 몰입감 있게 전달하는 것을 좋아한다.'
];

const options = values => values.map(x => `<option value="${x}">${x}</option>`).join('');
const questionCards = questions.map((text, i) => `<article class="question"><b>Q${i + 1}.</b><p>${text}</p><div class="scale" role="group" aria-label="Q${i + 1} 점수">${[1,2,3,4,5].map(score => `<label><input required type="radio" name="q${i + 1}" value="${score}"><span>${score}</span></label>`).join('')}</div></article>`).join('');

app.innerHTML = `
  <main>
    <header><span class="logo">M</span><div><h1>모여라</h1><p>더 잘 어울리는 조를 만드는 가장 쉬운 방법</p></div></header>
    <nav><button class="tab active" data-page="entry">학생 등록</button><button class="tab" data-page="teams">조 편성 및 관리</button></nav>
    <section id="entry" class="page active">
      <div class="card intro"><h2>학생 정보 등록</h2><p>입력한 정보는 해당 기수의 조 편성에만 사용됩니다.</p></div>
      <form id="student-form" class="card form-grid">
        <label>기수 <select name="cohort" required><option value="">선택</option>${options(cohorts)}</select></label>
        <label>이름 <input name="name" required placeholder="이름" /></label>
        <label>성별 <select name="gender" required><option value="">선택</option><option>여성</option><option>남성</option><option>응답 안 함</option></select></label>
        <label>학교 <input name="school" required placeholder="학교명" /></label>
        <label class="wide">희망 주제 <select name="topic" required><option value="">선택</option>${options(topics)}</select><small>같은 주제를 우선으로 조를 구성합니다.</small></label>
        <fieldset class="wide"><legend>역할 검사 <span>각 문항에 가장 가까운 점수를 선택해 주세요.</span></legend>
          <p class="scale-guide"><span>1 전혀 아니다</span><span>2 아니다</span><span>3 보통이다</span><span>4 그렇다</span><span>5 매우 그렇다</span></p>
          <div class="questions">${questionCards}</div>
          <div id="role-result" class="role-result">검사를 완료하면 희망 역할이 자동으로 정해집니다.</div>
        </fieldset>
        <button class="primary wide" type="submit">학생 정보 저장</button>
      </form>
      <p id="entry-status" class="status"></p>
    </section>
    <section id="teams" class="page">
      <div class="card intro">
        <h2>조 편성 및 데이터 관리</h2>
        <p>관리자 비밀번호를 입력하여 조를 추천받거나 등록된 학생 데이터를 관리합니다.</p>
      </div>

      <div class="card controls">
        <label>관리자 비밀번호 
          <input type="password" id="admin-pass" placeholder="비밀번호 입력" />
        </label>
      </div>

      <form id="team-form" class="card controls">
        <label>대상 기수 <select name="cohort" required><option value="">선택</option>${options(cohorts)}</select></label>
        <label>조별 인원 <input name="size" type="number" value="4" min="2" max="20" required /></label>
        <button class="primary" type="submit">조 추천 만들기</button>
      </form>
      <p id="team-status" class="status"></p>
      <div id="results"></div>

      <div class="card intro" style="margin-top: 2rem;">
        <h2>등록 학생 데이터 관리</h2>
        <button type="button" id="btn-load-students" class="primary" style="background:#4b5563;">학생 데이터 불러오기</button>
      </div>
      <div id="student-list" class="card" style="margin-top: 1rem;">
        <p style="color:#6b7280;">'학생 데이터 불러오기' 버튼을 누르면 목록이 표시됩니다.</p>
      </div>
    </section>
  </main>`;

document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.tab, .page').forEach(x => x.classList.remove('active'));
  button.classList.add('active'); 
  document.querySelector(`#${button.dataset.page}`).classList.add('active');
}));

const entryStatus = document.querySelector('#entry-status');
document.querySelector('#student-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!await connectFirebase()) return message(entryStatus, 'Firebase 설정값이 없습니다.', true);
  const f = new FormData(e.target); 
  const scores = Array.from({length:20}, (_,i) => Number(f.get(`q${i+1}`)));
  if (scores.some(x => !x)) return message(entryStatus, '역할 검사 20문항을 모두 답해 주세요.', true);
  const roles = getRoles(scores);
  const student = Object.fromEntries(['cohort','name','gender','school','topic'].map(k => [k, f.get(k).trim()]));
  try { 
    await firestore.addDoc(firestore.collection(db, 'students'), { ...student, roles, scores, createdAt: firestore.serverTimestamp() }); 
    e.target.reset(); 
    updateRoleResult(); 
    message(entryStatus, `${student.name} 학생 정보를 저장했어요. 배정 역할: ${roles.join(', ')}`); 
  } catch (err) { 
    message(entryStatus, `저장하지 못했어요: ${err.message}`, true); 
  }
});

function message(el, text, error = false) { 
  el.textContent = text; 
  el.className = `status ${error ? 'error' : 'success'}`; 
}

function getRoles(scores) { 
  const labels = ['기획 및 PM', '디자인', 'AI 프롬프터', '발표 및 테스터']; 
  const sums = [0,1,2,3].map(i => scores.slice(i*5, i*5+5).reduce((a,b)=>a+b,0)); 
  const high = Math.max(...sums); 
  return labels.filter((_, i) => sums[i] === high); 
}

function updateRoleResult() { 
  const data = new FormData(document.querySelector('#student-form')); 
  const scores = Array.from({length:20}, (_,i) => Number(data.get(`q${i+1}`))); 
  const result = document.querySelector('#role-result'); 
  if (scores.some(x => !x)) return result.textContent = '검사를 완료하면 희망 역할이 자동으로 정해집니다.'; 
  const sums = [0,1,2,3].map(i => scores.slice(i*5, i*5+5).reduce((a,b)=>a+b,0)); 
  result.innerHTML = `<b>추천 역할: ${getRoles(scores).join(', ')}</b><span>기획·PM ${sums[0]}점 · 디자인 ${sums[1]}점 · AI 프롬프터 ${sums[2]}점 · 발표·테스터 ${sums[3]}점</span>`; 
}

document.querySelector('#student-form').addEventListener('change', updateRoleResult);

// 조 편성 이벤트 (비밀번호 확인 포함)
document.querySelector('#team-form').addEventListener('submit', async e => {
  e.preventDefault(); 
  const status = document.querySelector('#team-status'); 
  const out = document.querySelector('#results'); 
  out.innerHTML = '';

  const inputPass = document.querySelector('#admin-pass').value;
  if (inputPass !== ADMIN_PASSWORD) {
    return message(status, '비밀번호가 올바르지 않습니다.', true);
  }

  if (!await connectFirebase()) return message(status, 'Firebase 설정값이 없습니다.', true);
  const f = new FormData(e.target), cohort = f.get('cohort').trim(), size = Number(f.get('size'));

  try {
    const snap = await firestore.getDocs(firestore.query(firestore.collection(db, 'students'), firestore.where('cohort', '==', cohort)));
    const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (students.length < 2) return message(status, `'${cohort}' 학생이 2명 이상 필요합니다.`, true);
    
    const teams = createTeams(students, size); 
    message(status, `${students.length}명을 ${teams.length}개 조로 편성했어요.`);
    out.innerHTML = teams.map((team, i) => `
      <article class="team">
        <h3>${i + 1}조 <span>${team.length}명</span></h3>
        ${team.map(s => `
          <div class="member">
            <b>${escapeHtml(s.name)}</b>
            <span>${escapeHtml(s.gender)} · ${escapeHtml(s.school)}</span>
            <small>${escapeHtml(s.topic)} · ${s.roles.map(escapeHtml).join(', ')}</small>
          </div>
        `).join('')}
      </article>
    `).join('');
  } catch (err) { 
    message(status, `불러오지 못했어요: ${err.message}`, true); 
  }
});

// 학생 목록 로드 및 삭제 버튼 클릭 이벤트 핸들러
document.addEventListener('click', async (e) => {
  if (e.target && e.target.id === 'btn-load-students') {
    const inputPass = document.querySelector('#admin-pass').value;
    if (inputPass !== ADMIN_PASSWORD) {
      alert('비밀번호가 올바르지 않습니다.');
      return;
    }
    if (!await connectFirebase()) return alert('Firebase 설정 오류');
    loadStudentList();
  }

  if (e.target && e.target.classList.contains('btn-delete-student')) {
    const studentId = e.target.dataset.id;
    const studentName = e.target.dataset.name;

    if (confirm(`${studentName} 학생을 삭제하시겠습니까?`)) {
      try {
        await firestore.deleteDoc(firestore.doc(db, 'students', studentId));
        alert('삭제되었습니다.');
        loadStudentList();
      } catch (err) {
        alert(`삭제 실패: ${err.message}`);
      }
    }
  }
});

async function loadStudentList() {
  const listEl = document.querySelector('#student-list');
  listEl.innerHTML = '불러오는 중...';

  try {
    const snap = await firestore.getDocs(firestore.collection(db, 'students'));
    if (snap.empty) {
      listEl.innerHTML = '<p>등록된 학생이 없습니다.</p>';
      return;
    }

    let html = '<table style="width:100%; border-collapse:collapse; text-align:left;">';
    html += '<tr style="border-bottom:2px solid #ddd;"><th>기수</th><th>이름</th><th>학교</th><th>주제</th><th>관리</th></tr>';
    
    snap.docs.forEach(doc => {
      const s = doc.data();
      html += `
        <tr style="border-bottom:1px solid #eee; height:40px;">
          <td>${escapeHtml(s.cohort || '-')}</td>
          <td><b>${escapeHtml(s.name || '-')}</b></td>
          <td>${escapeHtml(s.school || '-')}</td>
          <td>${escapeHtml(s.topic || '-')}</td>
          <td>
            <button class="btn-delete-student" data-id="${doc.id}" data-name="${escapeHtml(s.name)}" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">삭제</button>
          </td>
        </tr>
      `;
    });
    html += '</table>';
    listEl.innerHTML = html;
  } catch (err) {
    listEl.innerHTML = `<p style="color:red;">목록 불러오기 실패: ${err.message}</p>`;
  }
}

function createTeams(students, size) {
  const count = Math.ceil(students.length / size), capacities = Array.from({length:count}, (_,i) => Math.floor(students.length/count)+(i < students.length%count ? 1 : 0));
  let best;
  for (let run=0; run<80; run++) {
    const shuffled = [...students].sort(() => Math.random()-.5), teams = capacities.map(()=>[]);
    shuffled.forEach(s => { let options = teams.map((t,i) => t.length < capacities[i] ? i : -1).filter(i=>i>=0); const scores = options.map(i=>teamScore(teams[i],s)); const max=Math.max(...scores); teams[options[scores.indexOf(max)]].push(s); });
    improve(teams); if (!best || totalScore(teams)>totalScore(best)) best=teams;
  } return best;
}

function teamScore(team, s) { return team.reduce((score, x) => score + (x.topic===s.topic ? 12 : 0) - (x.school===s.school ? 3 : 0) - (x.roles.some(r=>s.roles.includes(r)) ? 5 : 0), 0); }
function totalScore(teams) { return teams.reduce((n,t)=>n+t.reduce((v,s,i)=>v+teamScore(t.slice(0,i),s),0),0); }
function improve(teams) { for(let k=0;k<1500;k++) { const a=Math.floor(Math.random()*teams.length), b=Math.floor(Math.random()*teams.length); if(a===b||!teams[a].length||!teams[b].length)continue; const i=Math.floor(Math.random()*teams[a].length),j=Math.floor(Math.random()*teams[b].length), before=totalScore(teams); [teams[a][i],teams[b][j]]=[teams[b][j],teams[a][i]]; if(totalScore(teams)<before)[teams[a][i],teams[b][j]]=[teams[b][j],teams[a][i]]; } }
function escapeHtml(v) { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
