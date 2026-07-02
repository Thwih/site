export function renderIntro() {
  return `
    <div class="card card-intro" id="introCard">
      <div class="intro-wrapper">
        <div class="avatar-wrapper">
          <div class="avatar-glow"></div>
          <div class="avatar-ring"></div>
          <div class="avatar"><img src="/src/assets/avatar.jpg" alt="Thwih Avatar" /></div>
        </div>
        <div class="intro-text">
          <div class="line1" data-i18n="hi">Hi, i am</div>
          <div class="line2">Thwih <span class="verified-badge"><img src="/src/assets/verified.png" alt="Verified" /></span></div>
          <div class="line3" data-i18n="tagline">and I'm a <span>Music Producer &amp; Developer</span></div>
        </div>
        <div class="slogan" data-i18n="slogan"><i class="fas fa-music"></i> Lấy nhạc miễn phí tại Thwih Music</div>
      </div>
    </div>
  `;
}