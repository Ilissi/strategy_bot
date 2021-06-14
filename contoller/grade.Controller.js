const db = require('../db')

const userController = require('../contoller/user.Controller')
const strategyController = require('../contoller/strategy.Controller')

class gradeController {

    async createGrade (response_json){
        let response;
        let mass = Object.values(response_json)
        try {
            response = await db.query('INSERT INTO strategy_grade(nickname, user_id, strategy_id, ' +
                'first_criterion, second_criterion, third_criterion, comment) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', mass);
            return response.rows;
        } catch (error) {
            return error;
        }
    }
    async checkResponse(strategy_id) {
        let countManagers, countGrades, author;
        try {
            countGrades = await db.query('SELECT nickname FROM strategy_grade WHERE strategy_id=$1', [strategy_id]);
            countManagers = await userController.getUsers('Риск-менеджер');
            author = await strategyController.getStrategyByUUID(strategy_id);
            if (await userController.checkPermission(author[0].id_telegram, 'Риск-менеджер')){
                if (countGrades.rowCount == countManagers.length-1) {
                    return true;
                }
                else return false;
            }
            else {
                if (countGrades.rowCount == countManagers.length) {
                    return true;
                }
                else return false;
            }


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

    async returnManagersApproved(strategy_id) {
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
}

module.exports = new gradeController()