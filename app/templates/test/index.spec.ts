import { helloThere } from '../src<% if(type === 'application') { %>/app<% } %>';

describe('Testing', () => {

    it('is important!', () => {
        expect(helloThere()).toBe('hello typescript!');
    });

});
