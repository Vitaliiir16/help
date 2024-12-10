export const initializeDFS = (nodes, endNodeId) => {
  const updatedNodes = nodes.map(n => ({...n, state:'unvisited'}))
  return {nodes: updatedNodes, stepHistory: [], currentNode: null, targetNode: endNodeId, stack: []}
}

export const startDFSProcess = (startId, endId, setIsRunning, setIsPaused, setTargetNode, setStack, setNodes) => {
  setIsRunning(true)
  setIsPaused(false)
  setTargetNode(endId)
  setNodes(p=>p.map(n=>({...n,state:'unvisited'})))
  setStack([startId])
}

function findCandidate(stack, nodesRef, setStack, isPausedRef, setIsRunning) {
  if (stack.length === 0) {
    alert('Цільова вершина не знайдена')
    setIsRunning(false)
    return null
  }
  if (isPausedRef.current) return null
  const c = stack[stack.length - 1]
  const cNode = nodesRef.current.find(n=>n.id===c)
  if (!cNode || cNode.state !== 'unvisited') {
    setStack(prev=>prev.slice(0,-1))
    return findCandidate(stack.slice(0,-1), nodesRef, setStack, isPausedRef, setIsRunning)
  }
  return c
}

export const performDFSStep = async ({nodesRef, edges, stack, setStack, updateNodeState, setStepHistory, delay, targetNode, isPausedRef, setIsRunning}) => {
  const candidate = findCandidate(stack, nodesRef, setStack, isPausedRef, setIsRunning)
  if (candidate === null) return

  updateNodeState(candidate, 'processing')
  setStepHistory(h=>[...h,candidate])
  await new Promise(r=>setTimeout(r,delay))

  if (candidate === targetNode) {
    updateNodeState(candidate, 'target')
    alert('Знайдено кінцеву вершину V' + targetNode)
    setIsRunning(false)
    return
  }

  const allNeighbors = edges.filter(e=>e.from===candidate).map(e=>e.to)
  const unvisitedNeighbors = allNeighbors.filter(id=>{
    const neighborNode = nodesRef.current.find(n=>n.id===id)
    return neighborNode && neighborNode.state==='unvisited'
  })

  setStack(s => [...s, ...unvisitedNeighbors.reverse(), ...s, ...s, ...unvisitedNeighbors.reverse()])


  updateNodeState(candidate,'visited')
  await new Promise(r=>setTimeout(r,delay))
}

export const pauseDFSProcess = (isRunning, setIsPaused, isPaused) => {
  if (!isRunning) return
  setIsPaused(!isPaused)
}

export const undoDFSProcess = (stepHistory, setStepHistory, setNodes, setStack, setCurrentNode) => {
  if (stepHistory.length===0) {
    alert('Немає попередніх кроків для відкату.')
    return
  }
  const newHistory = [...stepHistory]
  const lastVisitedNode = newHistory.pop()
  setNodes(prev=>prev.map(n=>n.id===lastVisitedNode?{...n,state:'unvisited'}:n))
  setStepHistory(newHistory)
  setStack(prev=>[...prev,lastVisitedNode])
  const previousNode = newHistory[newHistory.length-1]||null
  setCurrentNode(previousNode)
}

export const resetDFSProcess = (setNodes, setStepHistory, setCurrentNode, setTargetNode, setIsRunning, setIsPaused, setStack) => {
  setNodes(prev=>prev.map(n=>({...n,state:'unvisited'})))
  setStepHistory([])
  setCurrentNode(null)
  setTargetNode(null)
  setIsRunning(false)
  setIsPaused(false)
  setStack([])
}
