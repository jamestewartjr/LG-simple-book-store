var expect = require('expect.js')

const LIMIT=10
const pageToOffset = function(page){
  let offset = (page -1) * LIMIT;
  return offset
}
describe.only('pageToOffset', () => {
  it('1 -> 0',  () => { expect(pageToOffset(1)).to.eql(0) })
  it('2 -> 10', () => { expect(pageToOffset(2)).to.eql(10) })
  it('3 -> 20', () => { expect(pageToOffset(3)).to.eql(20) })
  it('4 -> 30', () => { expect(pageToOffset(4)).to.eql(30) })
})
