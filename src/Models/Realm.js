import Realm from 'realm';

class TransactionModel extends Realm.Object {
}

TransactionModel.schema = {
    name: 'TransactionModel',
    properties: {
        id: 'int',
        friendId: 'int',
        categoryId:'int',
        type: 'int', // 0 for given 1 for received
        amount: 'double',
        note: 'string',
        repeatingAccount: 'bool',
        date: 'date'
    }
};

class FriendModel extends Realm.Object {
}

FriendModel.schema = {
    name: 'FriendModel',
    properties: {
        id: 'int',
        name: 'string',
        number: 'string',
        rating:'float'
    }
};

class CategoryModel extends Realm.Object {}

CategoryModel.schema = {
    name:'CategoryModel',
    properties: {
        id:'int',
        categoryName:'string'
    }
}
export default new Realm({schema: [TransactionModel, FriendModel,CategoryModel]})
