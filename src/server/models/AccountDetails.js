const Sequelize=require("sequelize");
const bankAccountDB=require("../config/bank_account_DB");

const AccountDetails=bankAccountDB.define("accountDetails",{
    custId:{
        type:Sequelize.INTEGER,
        unique:true
    },
    pin:{
        type:Sequelize.INTEGER
    },
    balance:{
        type:Sequelize.INTEGER
    }
});

const createAccountDetailsTable=({force=false}={force:false})=>{    
    return new Promise((resolve,reject)=>{
        AccountDetails.sync({force})
        .then((result)=>{
            console.log("Account Details table created");
            resolve(result);
        })
        .catch(error=>{console.log(error);reject(error);})
    })
}

const createNewAccount=(custId,pin)=>{
    return new Promise((resolve,reject)=>{
        const adminAccount=AccountDetails.build({
            custId,
            pin,
            balance:1000
        });
        adminAccount.save()
        .then(result=>{
            resolve(result);
            })
        .catch(error=>{
            console.log(error);
            reject(error);
        });
    })
}
const authenticateUser=(custId,pin)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            await AccountDetails.findOne({
                where:{
                    custId,pin
                }
            })
        .then((user)=>{
            if(user!==null){
                resolve(user.get().custId);
            }
            else{
                throw(error)
            }
        })
        .catch(error=>{console.log(error);reject(error);})
        }
        catch(error){
            console.log(error);
            reject(error);
        }
    })
}
const withDraw=(amount,custId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
        const customer=await AccountDetails.findOne({
                    where:{
                    custId:custId
            }
        });
        console.log(customer);
        if(customer.balance<amount){
            throw(error);
        }
        else{
        await customer.decrement('balance',{by:amount})
            .then((result)=>{resolve(result)})
            .catch(error=>{
                console.log(error);
                reject(error);
            });
        }
    }
    catch(error){
        reject(error);
    }
    })
}
const deposit=(amount,custId)=>{
    return new Promise(async(resolve,reject)=>{
        const customer=await AccountDetails.findOne({
                    where:{
                    custId:custId
            }
        });
        console.log(customer);
        await customer.increment('balance',{by:amount})
        .then((result)=>{resolve(result)})
            .catch(console.error);
    })
}


const changePIN=(oldPin,newPin,custId)=>{
    return new Promise(async(resolve,reject)=>{
        await AccountDetails.findOne({
            where:{
            custId:custId,pin:oldPin
            }   
        })
    .then(async(customer)=>{
        await customer.update(
            {pin:newPin}
            )
            .then((result)=>{resolve(result)})
            .catch(error=>console.log(error));
    })
    .catch(error=>{
        console.log(error);
        reject(error)
    })
        
    })
}

const getBalance=(custId)=>{
    return new Promise(async(resolve,reject)=>{
        
        await AccountDetails.findOne({
            where:{
            custId:custId
            }   
        })
    .then(async(customer)=>{
        resolve(customer.balance);
    })
    .catch(error=>{
        console.log(error);
        reject(error)
    })
        
    })
}

exports.AccountDetails=AccountDetails;
exports.createAccountDetailsTable=createAccountDetailsTable;
exports.createNewAccount=createNewAccount;
exports.withDraw=withDraw;
exports.deposit=deposit;
exports.changePIN=changePIN;
exports.getBalance=getBalance;
exports.authenticateUser=authenticateUser;