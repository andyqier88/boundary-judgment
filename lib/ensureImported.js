// below code from https://github.com/bpmn-io/tiny-svg/blob/master/lib/util/ensureImported.js
export default function ensureImported(element, target) {

  if (element.ownerDocument !== target.ownerDocument) {
    try {
      // may fail on webkit
      return target.ownerDocument.importNode(element, true);
    } catch (e) {
      // ignore
    }
  }

  return element;
}

// use e.g.
/**
 * Append a node to a target element and return the appended node.
 *
 * @param  {SVGElement} element
 * @param  {SVGElement} target
 *
 * @return {SVGElement} the appended node
 */
 export default function appendTo(element, target) {
  return target.appendChild(ensureImported(element, target));
}

