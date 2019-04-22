import 'jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

/**
 * The following code (hack) was added to remove the following warning
 *
 *     Warning: An update to ProductBrowser inside a test was not wrapped in act(...).
 *     ...
 *
 * A quote from Kent C. Dodds on getting the following warning
 * (quote taken from https://github.com/kentcdodds/react-testing-library/issues/281):
 *
 * Ok so here's the scoop: If you want to get rid of the warnings
 * upgrade to react-dom@16.9.0-alpha.0 or wait until react-dom@16.9.0
 * is stably released, and then upgrade. It may be a few weeks before
 * 16.9.0 is actually released, so keep that in mind.
 *
 * If you don't want to upgrade, but still want to silence the warnings
 * for now, then you can add the following code to your setupTests.js file.
 * Then you can remove that when you do upgrade.
 */

// this is just a little hack to silence a warning that we'll get until react
// fixes this: https://github.com/facebook/react/pull/14853
const originalError = console.error
beforeAll(() => {
    console.error = (...args) => {
        if (/Warning.*not wrapped in act/.test(args[0])) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})
