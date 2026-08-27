// 그룹별 결과 안내 데이터
const GROUP_INFO = {
  nt: {
    name: "NT · 전략가형",
    types: "INTJ · INTP · ENTJ · ENTP",
    desc: "원리와 논리를 파고들어 이해하는 것을 좋아하는 전략가형 학습자예요. 큰 그림을 먼저 그리고, 효율적인 방법을 스스로 설계할 때 가장 잘 배워요.",
    page: "nt.html",
  },
  nf: {
    name: "NF · 몽상가형",
    types: "INFJ · INFP · ENFJ · ENFP",
    desc: "의미와 이야기로 연결될 때 몰입하는 몽상가형 학습자예요. 공부의 이유를 찾고, 사람들과 함께할 때 동기부여가 커져요.",
    page: "nf.html",
  },
  sj: {
    name: "SJ · 수호자형",
    types: "ISTJ · ISFJ · ESTJ · ESFJ",
    desc: "계획과 반복을 통해 꾸준히 실력을 쌓는 수호자형 학습자예요. 체계적인 루틴과 명확한 기준이 있을 때 안정적으로 성과를 내요.",
    page: "sj.html",
  },
  sp: {
    name: "SP · 활동가형",
    types: "ISTP · ISFP · ESTP · ESFP",
    desc: "직접 부딪히고 실전을 경험하며 배우는 활동가형 학습자예요. 짧고 굵게 몰입하는 실습형 공부법이 잘 맞아요.",
    page: "sp.html",
  },
};

// 우선순위: 동점일 때 앞쪽 그룹을 우선 표시
const PRIORITY = ["nt", "nf", "sj", "sp"];

function calculateResult(form) {
  const scores = { nt: 0, nf: 0, sj: 0, sp: 0 };
  const formData = new FormData(form);

  for (let i = 1; i <= 10; i++) {
    const value = formData.get("q" + i);
    if (!value) return null; // 미응답 문항 존재
    scores[value]++;
  }

  let topGroup = PRIORITY[0];
  for (const group of PRIORITY) {
    if (scores[group] > scores[topGroup]) topGroup = group;
  }

  return { scores, topGroup };
}

function renderResult(result) {
  const info = GROUP_INFO[result.topGroup];
  const resultBox = document.getElementById("result");

  document.getElementById("result-badge").textContent = result.topGroup.toUpperCase();
  document.getElementById("result-name").textContent = info.name;
  document.getElementById("result-types").textContent = info.types;
  document.getElementById("result-desc").textContent = info.desc;

  const scoreText = PRIORITY.map(
    (g) => `${g.toUpperCase()} ${result.scores[g]}점`
  ).join(" · ");
  document.getElementById("result-scores").textContent = scoreText;

  const goBtn = document.getElementById("go-group-btn");
  goBtn.href = info.page;
  goBtn.textContent = `${info.name} 공부법 보러가기`;

  resultBox.dataset.shareText = `나의 MBTI 공부유형은 [${info.name}]! 너의 공부유형도 확인해봐 → https://mbti-test-seven-pied.vercel.app/test.html`;

  resultBox.classList.add("show");
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleShare(resultBox) {
  const shareText = resultBox.dataset.shareText || "MBTI 공부법 연구소에서 내 공부유형을 확인해보세요!";

  if (navigator.share) {
    navigator.share({ text: shareText }).catch(() => {});
    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(shareText)
      .then(() => alert("결과가 클립보드에 복사되었어요. 친구에게 붙여넣어 보내보세요!"))
      .catch(() => alert(shareText));
    return;
  }

  alert(shareText);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("test-form");
  const resultBox = document.getElementById("result");
  const shareBtn = document.getElementById("share-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = calculateResult(form);

    if (!result) {
      alert("모든 문항에 답변해 주세요!");
      return;
    }

    renderResult(result);
  });

  shareBtn.addEventListener("click", () => handleShare(resultBox));
});
