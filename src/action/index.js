export const ADD_NUMBER = (num) => {
  return {
    type: "ADD_NUMBER",
    num,
  }
}

export const SUB_NUMBER = (num) => {
  return {
    type: "SUB_NUMBER",
    num,
  }
}

export const INCREMENT = () => {
  return {
    type: "INCREMENT"
  }
}

export const DECREMENT = () => {
  return {
    type: "DECREMENT"
  }
}
