'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITIES_OF_FUNCTIONS = {
    'filterIn': 1,
    'sortBy': 2,
    'select': 3,
    'format': 4,
    'limit': 5
};
/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copy = getCopy(collection);
    if (arguments.length === 1) {
        return copy;
    }
    var functions = [].slice.call(arguments).slice(1);
    var sortedFunctions = functions.sort(function (func1, func2) {
        return PRIORITIES_OF_FUNCTIONS[func1.name] > PRIORITIES_OF_FUNCTIONS[func2.name] ? 1 : -1;
    });
    for (var func = 0; func < sortedFunctions.length; func++) {
        copy = sortedFunctions[func](copy);
    }

    return copy;
};

function getCopy(collection) {
    var copy = [];
    for (var i = 0; i < collection.length; i++) {
        var person = {};
        var fields = Object.keys(collection[i]);
        for (var field in fields) {
            person[fields[field]] = collection[i][fields[field]];
        }
        copy.push(person);
    }
    return copy;
}
/**
 * Выбор полей
 * @params {...String}
 */

exports.select = function () {
    var args = [].slice.call(arguments);
    
    return function select(collection) {
        for (var person = 0; person < collection.length; person++) {
            var keys = Object.keys(collection[person]);
            for (var property = 0; property < keys.length; property++) {
                if (args.indexOf(keys[property]) === -1) {
                     delete collection[person][keys[property]];
                 }
            }
        }
        return collection;
    }
  };

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 */
exports.filterIn = function (property, values) {
    //console.info(property, values);

    return function filterIn(collection) {
        return collection.filter(function (person) {
            return (values.indexOf(person[property]) !== -1);
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 */
exports.sortBy = function (property, order) {
    //console.info(property, order);

    return function sortBy(collection) {
        return collection.sort(function (person1, person2) {
            if (order === 'asc') {
                return person1[property] > person2[property];
            }
            return person2[property] < person1[property];
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 */
exports.format = function (property, formatter) {
    //console.info(property, formatter);

    return function format(collection) {
        return collection.map(function (person) {
            if (person.hasOwnProperty(property)) {
                person[property] = formatter(person[property]);
            }

            return person;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 */
exports.limit = function (count) {
    //console.info(count);

    return function limit(collection) {
        return collection.slice(0, count);
        };
    };

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
