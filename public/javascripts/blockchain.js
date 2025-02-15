const difficulty = 4 // number of zeros required at front of hash
const maximumNonce = 500_000 // limit the nonce to this so we don't mine too long

// NOTE: Because there are 16 possible characters in a hex value, each time you increment
// the difficulty by one you make the puzzle 16 times harder. In my testing, a difficulty
// of 6 requires a maximumNonce well over 500,000,000.

/////////////////////////
// global variable setup
/////////////////////////
let pattern = ''
for (let x = 0; x < difficulty; x++) {
  pattern += '0'
}

/////////////////////////
// functions
/////////////////////////
const sha256 = (block, chain) => {
  // calculate a SHA256 hash of the contents of the block
  return CryptoJS.SHA256(getText(block, chain))
}

const updateState = (block, chain) => {
  // set the well background red or green for this block
  if (
    $('#block' + block + 'chain' + chain + 'hash')
      .val()
      .substr(0, difficulty) === pattern
  ) {
    $('#block' + block + 'chain' + chain + 'well')
      .removeClass('well-error')
      .addClass('well-success')
  } else {
    $('#block' + block + 'chain' + chain + 'well')
      .removeClass('well-success')
      .addClass('well-error')
  }
}

const updateHash = (block, chain) => {
  // update the SHA256 hash value for this block
  $('#block' + block + 'chain' + chain + 'hash').val(sha256(block, chain))
  updateState(block, chain)
}

const updateChain = (block, chain) => {
  // update all blocks walking the chain from this block to the end
  for (let x = block; x <= 5; x++) {
    if (x > 1) {
      $('#block' + x + 'chain' + chain + 'previous').val(
        $('#block' + (x - 1).toString() + 'chain' + chain + 'hash').val()
      )
    }
    updateHash(x, chain)
  }
}

const mine = (block, chain, isChain) => {
  for (let x = 0; x <= maximumNonce; x++) {
    $('#block' + block + 'chain' + chain + 'nonce').val(x)
    $('#block' + block + 'chain' + chain + 'hash').val(sha256(block, chain))
    if (
      $('#block' + block + 'chain' + chain + 'hash')
        .val()
        .substr(0, difficulty) === pattern
    ) {
      if (isChain) {
        updateChain(block, chain)
      } else {
        updateState(block, chain)
      }
      break
    }
  }
}
