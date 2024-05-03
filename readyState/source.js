(() => {
  var doGetHtmlElement = (theSelector) => document.querySelector(theSelector);

  var typeSetClassToHtmlElement = (theHtmlElement) => (theClassName) =>
    theHtmlElement.classList.add(theClassName);

  var typeSetInnerTextToHtmlElement = (theHtmlElement) => (theText) =>
    (theHtmlElement.innerText = theText);

  var typeSetTextSetClassToHtmlElementBySelector = (theHtmlSelector) => {
    var theHtmlElement = doGetHtmlElement(theHtmlSelector);
    var doSetClass = typeSetClassToHtmlElement(theHtmlElement);
    var doSetText = typeSetInnerTextToHtmlElement(theHtmlElement);
    return (theClassName) => (theText) => (
      doSetClass(theClassName), doSetText(theText)
    );
  };

  var theCSSClassAboutInform = "countDown__text_inform";

  var theTextAboutBadaBoom = "Fail";
  var theCSSClassAboutBadaBoom = "countDown__text_boom";

  var theTextAboutDeactivation = "You did it";
  var theCSSClassAboutDeactivation = "countDown__text_ok";

  var theNumberUntilTheBadaBoom = 5;
  var theTimeInterval = 1000;

  var theCSSSelectorWhereWeWillInform = ".countDown__text";
  var theTestingStage = "complete";

  var typeSetTextSetClassToHtmlElement =
    typeSetTextSetClassToHtmlElementBySelector(theCSSSelectorWhereWeWillInform);

  var doSetBlackText = typeSetTextSetClassToHtmlElement(theCSSClassAboutInform);
  var doSetGreenText = typeSetTextSetClassToHtmlElement(
    theCSSClassAboutDeactivation,
  );
  var doSetRedText = typeSetTextSetClassToHtmlElement(theCSSClassAboutBadaBoom);

  var typeTestReadyState = (theStage) => (theState) => theState === theStage;

  var doCheckOfDocumentState = typeTestReadyState(theTestingStage);

  // var doCheck = () =>
  //   doSetBlackText(theNumberUntilTheBadaBoom--) ||
  //   (doCheckOfDocumentState(document.readyState)
  //     ? doSetRedText(theTextAboutBadaBoom)
  //     : doCheckOfDocumentState(document.readyState)
  //       ? doSetGreenText(theTextAboutDeactivation)
  //       : doSetRedText(theTextAboutBadaBoom),
  //   false);

  var doCheck = () => {
    doSetBlackText(theNumberUntilTheBadaBoom--);
    if (doCheckOfDocumentState(document.readyState)) {
      doSetRedText(theTextAboutBadaBoom);
      return true;
    }
    if (theNumberUntilTheBadaBoom === 0) {
      doSetGreenText(theTextAboutDeactivation);
      return true;
    }
    return false;
  };


  // ((theTimeInterval) => (doContinueCondition) => {
  //   var theInterval = setInterval(
  //     () => doContinueCondition() || clearInterval(theInterval),
  //     theTimeInterval,
  //   );
  //   return theInterval;
  // })(theTimeInterval)(doCheck);

  const interval = setInterval(() => {
    if (doCheck()) {
      clearInterval(interval);
    }
  }, theTimeInterval);

})();
