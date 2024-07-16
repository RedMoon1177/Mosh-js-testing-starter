
////// MOCK MODULES ///////////////
vi.mock('../src/libs/currency'); // this line will be run first (before import) to 
// create mock functions with default behaviors (do nothing) for all functions in module currency => and then import the mocked functions
// In JS, this is called Hoisting! (meaning a line of code is pushed to the top of the file)
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');

// PARTIAL MOCKING
vi.mock('../src/libs/email', async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...originalModule,
        sendEmail: vi.fn(),
    }
});
///////////////////////////////////

import { vi, it, expect, describe, beforeEach } from 'vitest';
import { getDiscount, getPriceInCurrency, getShippingInfo, isOnline, login, renderPage, signUp, submitOrder } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';


// describe('test suit', () => {
//     it('test case', () => {

//         // new a mock function
//         const greet = vi.fn();

//         // if want greet() return a value
//         // greet.mockReturnValue("Hello");

//         // if want to implement greet()
//         greet.mockImplementation(name => "Hello" + name);


//         const result = greet("Mosh");
//         // console.log(result);
//         expect(greet).toHaveBeenCalled();
//     })
// })

// describe('test suit', () => {
//     it('test case', () => {
//         // Create a mock for the following function
//         // sendText(message) {}
//         const sendText = vi.fn();
//         sendText.mockReturnValue('ok');

//         // Call the mock function
//         const result = sendText('message');

//         // Assert that the mock function is called
//         expect(sendText).toHaveBeenCalledWith('message');
//         // Assert that the result is 'ok'
//         expect(result).toBe('ok');
//         // expect(sendText).toHaveReturnedWith('ok');
//     })
// })

// describe('getPriceInCurrency', () => {
//     it('should return price in target currency', () => {
//         // We want to mock because not want to get the random value of the exchange rate
//         vi.mocked(getExchangeRate).mockReturnValue(1.5);

//         const price = getPriceInCurrency(10, 'AUD');

//         expect(price).toBe(15);
//     })
// })


// 5 - Exercise: Testing getShippingInfo
// describe('getShippingInfo', () => {
//     it('should return shipping cost if given valid destination', () => {
//         vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });

//         const result = getShippingInfo('Australia');

//         // expect(result).toBe("Shipping Cost: $10 (2 Days)")
//         expect(result).toMatch('$10');
//         expect(result).toMatch(/2 days/i);
//         expect(result).toMatch(/shipping cost: \$10 \(2 days\)/i);
//     });

//     it('shoulr return shipping info if quote cannot be fetched', () => {
//         vi.mocked(getShippingQuote).mockReturnValue(null);

//         const result = getShippingInfo('London');

//         expect(result).toMatch(/unavailable/i);
//     });
// })

// 6 - Interaction testing
// describe('renderPage', () => {
//     it('should return correct content', async () => {
//         const result = await renderPage();

//         expect(result).toMatch(/content/i);
//     });

//     it('should call analytics', async () => {
//         await renderPage();

//         expect(trackPageView).toHaveBeenCalledWith('/home');
//     })
// })

// 7 - Exercise: Testing submitOrder
// my solution
// describe('submitOrder', () => {
//     it('should return success if the payment result is well done', async () => {
//         vi.mocked(charge).mockReturnValue({ status: 'success' });

//         let creditCard;
//         let order = { totalAmount: 0 };
//         const result = await submitOrder(order, creditCard);

//         expect(result.success).toBe(true);
//     });

//     it('should return error if the payment result is failed', async () => {
//         vi.mocked(charge).mockReturnValue({ status: 'failed' });

//         let creditCard;
//         let order = { totalAmount: 0 };
//         const result = await submitOrder(order, creditCard);

//         expect(result.success).toBe(false);
//         expect(result.error).toMatch(/payment_error/i);
//     });
// })

// Mosh solution
// describe('submitOrder', () => {
//     const order = { totalAmount: 10 };
//     const creditCard = { creditCardNumber: '1234' };

//     // testing the interaction with the mocked charge()
//     it('should charge the customer', async () => {
//         // mock the resolved value (not returned) since this func return a promise!
//         vi.mocked(charge).mockResolvedValue({ status: 'success' });

//         await submitOrder(order, creditCard);

//         expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
//     });

//     it('should return success when payment is successful', async () => {
//         vi.mocked(charge).mockResolvedValue({ status: 'success' });
//         const result = await submitOrder(order, creditCard);
//         expect(result).toEqual({ success:  true });
//     });

//     it('should return success when payment is failed', async () => {
//         vi.mocked(charge).mockResolvedValue({ status: 'failed' });
//         const result = await submitOrder(order, creditCard);
//         expect(result).toEqual({ success:  false, error: 'payment_error' });
//     });
// })


// 8 - Partial Mocking
// describe('signUp', () => {

//     const email = 'anne@gmail.com';

//     // beforeEach(() => {
//     //     // vi.mocked(sendEmail).mockClear(); // this clear our state of the mocked function before each test
//     //     // or
//     //     vi.clearAllMocks();
//     //     // or setup clearMocks: true in a vitest.config.js file (this file will be run once when we run "npm test")
//     // })

//     it('should return false if email is not valid', async () => {
//         const result = await signUp('a');

//         expect(result).toBe(false);
//     });

//     it('should return true if email is valid', async () => {
//         const result = await signUp(email);

//         expect(result).toBe(true);
//     });

//     // testing interaction with sendEmail()
//     it('should send the welcome email if email is valid', async () => {
//         const result = await signUp(email);

//         // expect(sendEmail).toHaveBeenCalled();
//         expect(sendEmail).toHaveBeenCalledOnce();

//         // "calls" property: tracking all the calls to this function (calls[0]: the first call)
//         const args = vi.mocked(sendEmail).mock.calls[0]
//         expect(args[0]).toBe(email);
//         expect(args[1]).toMatch(/welcome/i);
//     });
// })

// 9 - Spying on Functions
// describe('login', () => {
//     it('should email the one-time login code', async () => {
//         const email = 'name@domain.com';
//         const spy = vi.spyOn(security, 'generateCode');

//         await login(email);

//         const securityCode = spy.mock.results[0].value.toString();
//         expect(sendEmail).toHaveBeenCalledWith(email, securityCode);

//         // testing interaction with the mocked sendEmail() without spying generateCode() to get the security code
//         // expect(sendEmail).toHaveBeenCalled();
//     })
// })

// 12 - Mocking Dates
// describe('isOnline', () => {
//     it('should return false if current hour is outside opening hours', () => {
//         vi.setSystemTime('2024-01-01 07:59');
//         expect(isOnline()).toBe(false);

//         vi.setSystemTime('2024-01-01 20:01');
//         expect(isOnline()).toBe(false);
//     });

//     it('should return true if current hour is within opening hours', () => {
//         vi.setSystemTime('2024-01-01 08:00');
//         expect(isOnline()).toBe(true);

//         vi.setSystemTime('2024-01-01 19:59');
//         expect(isOnline()).toBe(true);
//     })
// })


// 13 - Exercise: Testing getDiscount
describe('getDiscount', () => {
    it('should return 20% discount on Christmas day', () => {
        vi.setSystemTime('2024-12-25 00:00');
        expect(getDiscount()).toBe(0.2);

        vi.setSystemTime('2024-12-25 23:59');
        expect(getDiscount()).toBe(0.2);
    });

    it('should return 0% discount on any other day', () => {
        vi.setSystemTime('2024-12-24 00:00');
        expect(getDiscount()).toBe(0);

        vi.setSystemTime('2024-12-26 23:59');
        expect(getDiscount()).toBe(0);
    });
})