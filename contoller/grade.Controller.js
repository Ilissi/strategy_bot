const db = require('../db')
const userController = require('../contoller/user.Controller')


class gradeController {

    async createGrade (response_json){
        let response;
        let mass = Object.values(response_json)
        console.log(mass)
        try {
            response = await db.query('INSERT INTO strategy_grade(nickname, user_id, strategy_id, ' +
                'first_criterion, order_type, second_criterion, price_entity, portfolio, comment) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', mass);
            return response.rows;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    async checkResponse(strategy_id) {
        let countManagers, countGrades;
        try {
            countGrades = await db.query('SELECT nickname FROM strategy_grade WHERE strategy_id=$1', [strategy_id]);
            countManagers = await userController.getAllUsers();
            if (countGrades.rowCount == countManagers.length-1) {
                return true;
            }
            else return false;
        } catch (error) {
            return error;
        }
    }

    async returnGrades(strategy_id) {
        let response;
        try {
            response = await db.query('SELECT * FROM strategy_grade WHERE strategy_id=$1', [strategy_id]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async returnApproved(strategy_id) {
        let response;
        try {
            response = await db.query('SELECT user_id FROM strategy_grade WHERE strategy_id=$1', [strategy_id]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async checkAccepted(strategy_id, telegram_id) {
        let response;
        try {
            response = await db.query('SELECT * FROM strategy_grade WHERE strategy_id=$1 and user_id=$2', [strategy_id, telegram_id]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async CheckPortfolio(strategy_id){
        let response;
        try {
            response = await db.query('SELECT * FROM strategy_grade WHERE strategy_id=$1 and portfolio=$2', [strategy_id, 'Да']);
            return response.rows;
        } catch (error){
            return error;
        }
    }

    async CheckOrder(strategy_id){
        let response;
        try {
            response = await db.query('SELECT * FROM strategy_grade WHERE strategy_id=$1 and order_type=$2', [strategy_id, 'Сохранить']);
            return response.rows;
        } catch (error){
            return error;
        }
    }
}

module.exports = new gradeController()