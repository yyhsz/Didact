const Didact = {}
// createElement

/** @jsx Didact.createElement */
Didact.createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  }
}
createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

/** next Fiber */
let nextUnitOfWork = null;
const workLoop = (ddl) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = ddl.timeRemaining() < 1;
  }
  // !! 函数执行结束后需要再次requestIdleCallback
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)


const createDom = (fiber) => {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode() : document.createElement(fiber.type);

  Object.keys(fiber.props).filter(key => key !== 'children').forEach(key => {
    dom.key = fiber.props[key]
  })

  return dom;
}


// old render
// function render(element, container) {
//   const dom =
//     element.type == "TEXT_ELEMENT"
//       ? document.createTextNode("")
//       : document.createElement(element.type)
// ​
//   const isProperty = key => key !== "children"
//   Object.keys(element.props)
//     .filter(isProperty)
//     .forEach(name => {
//       dom[name] = element.props[name]
//     })
// ​
//   element.props.children.forEach(child => // 深度优先，每一个child都
//     render(child, dom)
//   )
// ​
//   container.appendChild(dom)
// }

// 
const performUnitOfWork = (fiber) => {
  // 1.1 createDOM
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 1.2 建立联系
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber);
  }
  // 2. create Fiber for children 
  let prevSiblingFiber = null;
  fiber.props.children.forEach((element, index) => {
    const newFiber = {
      ...element,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    }
    if (prevSiblingFiber) {
      prevSiblingFiber.sibling = newFiber
    }
    prevSiblingFiber = newFiber
  })
  // 3. 输出nextUnitOfWork
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent;
  }
}

// render
Didact.render = (element, container) => {
  nextUnitOfWork = {
    ...element,
    parent: null,
    child: null,
    sibling: null,
    dom: null
  }
}