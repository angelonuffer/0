// Semantic call-stack helper: track current call frames for better error stacks

const pilhaAtual = [];

export const pushFrame = (frame) => {
  pilhaAtual.push(frame);
};

export const popFrame = () => {
  pilhaAtual.pop();
};

// Return a snapshot formatted for attaching to an Error: most-recent-first
export const getSnapshotForError = () => {
  return pilhaAtual.slice().reverse();
};
