document.write("<!--");

document.addEventListener("DOMContentLoaded", () => {
  const commentNode = Array.prototype.find.call(
    document.body.childNodes,
    (node) => node.nodeType === document.COMMENT_NODE,
  );
  const script = document.createElement("script");
  script.textContent = commentNode.data
    .match(/<script>([^<]*)<\/script>/)[1]
    .replace("( document.readyState )", "('loading')");
  document.body.appendChild(script);
  commentNode.remove();
});
