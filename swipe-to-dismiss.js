var HORIZONTAL_MARGIN = 16;
var VERTICAL_MARGIN = 8;

var page = tabris.create("Page", {
  title: "Swipe to dismiss",
  topLevel: true
});

var items = [
  {title: "Up for lunch?", sender: "John Smith", time: "11:35"},
  {title: "JavaScript for mobile applications", sender: "JavaScript Newsletter", time: "08:03"},
  {title: "This is just a spam message", sender: "Spammer", time: "04:32"},
  {title: "CoolGrocery Discount Newsletter", sender: "Local CoolGrocery", time: "yesterday"},
  {title: "Cinema this weekend?", sender: "Robert J. Schmidt", time: "yesterday"},
  {title: "Coffee Club Newsletter", sender: "Coffee Club", time: "yesterday"},
  {title: "Fraud mail", sender: "Unsuspicious Jack", time: "yesterday"}
];

var collectionView = tabris.create("CollectionView", {
  layoutData: {left: 0, right: 0, top: 0, bottom: 0},
  itemHeight: 64,
  items: items,
  initializeCell: function(cell) {
    cell.set("background", "#d0d0d0");
    var container = tabris.create("Composite", {
      background: "white",
      layoutData: {left: 0, top: 0, bottom: 0, right: 0}
    }).on("pan:horizontal", function(event) {
      handlePan(event, container);
    }).appendTo(cell);
    var senderView = tabris.create("TextView", {
      font: "bold 18px",
      layoutData: {top: VERTICAL_MARGIN, left: HORIZONTAL_MARGIN}
    }).appendTo(container);
    var titleView = tabris.create("TextView", {
      layoutData: {bottom: VERTICAL_MARGIN, left: HORIZONTAL_MARGIN}
    }).appendTo(container);
    var timeView = tabris.create("TextView", {
      foreground: "#b8b8b8",
      layoutData: {top: VERTICAL_MARGIN, right: HORIZONTAL_MARGIN}
    }).appendTo(container);
    tabris.create("Composite", {
      background: "#b8b8b8",
      layoutData: {left: 0, bottom: 0, right: 0, height: 1}
    }).appendTo(cell);
    cell.on("itemchange", function(message) {
      container.set({transform: {}, message: message});
      senderView.set("text", message.sender);
      titleView.set("text", message.title);
      timeView.set("text", message.time);
    });
  }
}).appendTo(page);

function handlePan(event, container) {
  container.set("transform", {translationX: event.translation.x});
  if (event.state === "end") {
    handlePanFinished(event, container);
  }
}

function handlePanFinished(event, container) {
  var translation = Math.abs(event.translation.x);
  var velocity = Math.abs(event.velocity.x);
  var consistentDirection = sign(event.translation.x) === sign(event.velocity.x);
  var bounds = container.get("bounds");
  if ((translation > bounds.width / 2 || velocity > 700) && consistentDirection) {
    animateDismiss(event, container, bounds);
  } else {
    animateCancel(event, container);
  }
}

function animateDismiss(event, container, bounds) {
  container.animate({
    transform: {translationX: sign(event.velocity.x) * bounds.width}
  }, {duration: 200, easing: "ease-out"}).once("animationend", function() {
    var index = collectionView.get("items").indexOf(container.get("message"));
    collectionView.remove(index);
  });
}

function animateCancel(event, container) {
  container.animate({transform: {translationX: 0}}, {duration: 200, easing: "ease-out"});
}

function sign(number) {
  return number ? number < 0 ? -1 : 1 : 0;
}

page.open();
