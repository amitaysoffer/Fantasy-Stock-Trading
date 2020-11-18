const db = require('../db/auth');
const authCtrl = require('../controllers/authController');
const StockErrorHandler = require('../error/StockErrorHandler');

jest.mock('../db/auth');

class UserSession {
    constructor(userId, userEmail, userFirstName, userLastName, sessionId) {
        this.user = { id: userId, email: userEmail, firstName: userFirstName, lastName: userLastName }
        this.sessionId = sessionId;
    }
}

describe("Auth Controller Tests", () => {
    describe("Register User Tests", () => {

        test('Testing DB Queries Parameters', async () => {
            //Mock Values
            const request = { body: { email: 'alielreyes@gmail.com', firstName: 'Aliel', lastName: 'Reyes', password: 'test123', termsCheck: true } };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
            const user = { id: "UserID1" , email: "alielreyes@gmail.com" , first_name: "Aliel" , last_name: "Reyes" };
            const sessionId = "SessionID";
            const userSession = new UserSession(user.id, user.email, user.first_name, user.last_name, sessionId);
    
            //Mocking DB Functions
            db.addUser.mockReturnValue();
            db.getUser.mockReturnValue(user);
            db.createUserSession.mockReturnValue(sessionId);
        
            //Main Function
            await authCtrl.register(request, response);
    
            //Assert Tests
            expect(db.addUser).toHaveBeenCalledWith(request.body.email, request.body.firstName, request.body.lastName, request.body.password, request.body.termsCheck);
            expect(db.getUser).toHaveBeenCalledWith(request.body.email, request.body.password);
            expect(db.createUserSession).toHaveBeenCalledWith(user);
            expect(response.send).toHaveBeenCalledWith(userSession);
        });
    
        test('Response should send userSession object', async () => {
            //Mock Values
            const request = { body: { email: 'alielreyes@gmail.com', firstName: 'Aliel', lastName: 'Reyes', password: 'test123', termsCheck: true } };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
            const user = { id: "UserID1" , email: "alielreyes@gmail.com" , first_name: "Aliel" , last_name: "Reyes" };
            const sessionId = "SessionID";
            const userSession = new UserSession(user.id, user.email, user.first_name, user.last_name, sessionId);
    
            
            //Mocking DB Functions
            db.addUser.mockReturnValue();
            db.getUser.mockReturnValue(user);
            db.createUserSession.mockReturnValue(sessionId);
        
            //Main function
            await authCtrl.register(request, response);
            
            //Assert
            expect(response.send.mock.results[0].value).toEqual(userSession);
        });
    
        test('Response should send error object', async () => {
            const errorMsg = 'Mock Error Test';
            const request = { body: { email: 'alielreyes@gmail.com', firstName: 'Aliel', lastName: 'Reyes', password: 'test123', termsCheck: true } };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
            //Mocking DB Functions
            db.addUser.mockImplementation(() => {
                throw new Error(errorMsg);
            });
        
            //Main function
            await authCtrl.register(request, response);
            
            //Assert
            let error = response.send.mock.results[0].value;
            let errorHandler = new StockErrorHandler(`Server Error, could not register: ${errorMsg}`);
            
            expect(error).toEqual(errorHandler);
        });
    })
    
    describe("Login User Tests", () => {
        //Test response
        test('Response should be user session', async () => {
            const request = { body: { email: 'alielreyes@gmail.com', password: 'test123'} };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
            const user = { id: "UserID1" , email: "alielreyes@gmail.com" , first_name: "Aliel" , last_name: "Reyes" };
            const sessionId = "SessionID";
            const userSession = new UserSession(user.id, user.email, user.first_name, user.last_name, sessionId);
    
            db.getUser.mockReturnValue(user);
            db.createUserSession.mockReturnValue(sessionId);
    
            await authCtrl.login(request, response);
            
            expect(response.send.mock.results[0].value).toEqual(userSession);
        });
    
        //Test errors
        test('Response should send error object', async () => {
            const errorMsg = 'Mock Error Test';
            const request = { body: { email: 'alielreyes@gmail.com', firstName: 'Aliel', lastName: 'Reyes', password: 'test123', termsCheck: true } };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
            
            //Mocking DB Functions
            db.getUser.mockImplementation(() => {
                throw new Error(errorMsg);
            });
        
            //Main function
            await authCtrl.login(request, response);
            
            //Assert
            let error = response.send.mock.results[0].value;
            let errorHandler = new StockErrorHandler(`Server Error, could not login: ${errorMsg}`);
            
            expect(error).toEqual(errorHandler);
        });
    
    });
    
    describe("Logout User Tests", () => {
        test('Testing DB Query Parameters', async() => {
            const request = { headers: { authorization: 'Bearer token' } };
            const response = { send: jest.fn(obj => obj) };
            const sessionId = 'token';
    
            db.destroyUserSession.mockReturnValue();
    
            await authCtrl.logout(request, response);
    
            expect(db.destroyUserSession).toHaveBeenCalledWith(sessionId);
        });
    
        test('Response should be success object', async () => {
            const request = { headers: { authorization: 'Bearer token' } };
            const response = { send: jest.fn(obj => obj) };
    
            db.destroyUserSession.mockReturnValue();
    
            await authCtrl.logout(request, response);
    
            expect(response.send.mock.results[0].value).toEqual({ success: true });
        });
    
        test('Response should be missing auth header', async() => {
            const request = { headers: { authorization: '' } };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
    
            db.destroyUserSession.mockReturnValue();
    
            await authCtrl.logout(request, response);
    
            const errorHandler = new StockErrorHandler('Server error, could not logout: Missing Authorization Header');
            expect(response.send.mock.results[0].value).toEqual(errorHandler);
        });
    
        test('Response should send error object', async() => {
            const request = { headers: { authorization: 'Bearer token' } };
            const response = { 
                statusCode: 200,
                send: jest.fn(obj => obj),
                status: jest.fn(code => {statusCode=code; return response})
            };
            const errorMsg = "Mock Error";
            db.destroyUserSession.mockImplementation(() => {
                throw new Error(errorMsg);
            });
    
            await authCtrl.logout(request, response);
    
            const errorHandler = new StockErrorHandler(`Server error, could not logout: ${errorMsg}`);
            expect(response.send.mock.results[0].value).toEqual(errorHandler);
        });
    });
})
