

// Ensure simpleDOM loaded properly to the window
describe("simpleDOM global variable assignment", function() {
  it("simpledom is not null", function() {
    expect(simpleDOM !== null).toBe(true);
  });
  it("$ is not null", function() {
    expect($ !== null).toBe(true);
  });
  it("$ is simpledom", function() {
    expect($ === simpleDOM).toBe(true);
  });
});


// Run tests ensuring basic selectors return what's expected
describe('basic selectors', function(){

  document.body.innerHTML = window.__html__['tests/fixtures/ul.html'];

  it("ul length is 1", function() {
    expect($('ul').length).toBe(1);
  });

  it("#myUl length is 1", function() {
    expect($('#myUl').length).toBe(1);
  });

  it("fake element doesn't exist", function() {
    expect($('fake').length).toBe(0);
  });

  it("#myUl li length is 5", function() {
    expect($('#myUl li').length).toBe(5);
  });

});


// CSS Class tests
describe('css class manipulation', function(){

  document.body.innerHTML = window.__html__['tests/fixtures/ul.html'];

  it("ul starts with no class", function() {
    expect($('ul').hasClass('jasmine')).toBe(false);
  });

  it("ul now has class 'jasmine'", function() {
    $('ul').addClass('jasmine');
    expect($('ul').hasClass('jasmine')).toBe(true);
  });

  it("getClasses returns an array with current class", function() {
    $('ul').addClass('karma');
    expect($('ul').getClasses()).toEqual(['jasmine','karma']);
  });

  it("ul now has no class 'jasmine'", function() {
    $('ul').removeClass('jasmine');
    expect($('ul').hasClass('jasmine')).toBe(false);
  });

});