const styles = document.styleSheets[0];


const ok = styles.cssRules[5];
const fail = styles.cssRules[4];


styles.insertRule(`.countDown__text_boom { 
  display: inline-block;
  color: green;
}`, styles.cssRules.length);

styles.insertRule(`.countDown__text_boom::before {
  display: block;
  content: "You did it";
}`, styles.cssRules.length);
