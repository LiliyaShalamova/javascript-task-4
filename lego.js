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
    if (arguments.length === 1) {
        return collection;
    }
    var result = getCopy(collection);
    var functions = [].slice.call(arguments).slice(1);
    var sortedFunctions = functions.sort(function (func1, func2) {
        return PRIORITIES_OF_FUNCTIONS[func1.name] > PRIORITIES_OF_FUNCTIONS[func2.name] ? 1 : -1;
    });
    sortedFunctions.forEach(function (func) {
        result = func(result);
    });

    return result;
};

function getCopy(collection) {
    return JSON.parse(JSON.stringify(collection));
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */

function filterProperty(properties, person) {
    var keys = Object.keys(person);
    var newPerson = {};
    for (var p = 0; p < properties.length; p++) {
        if (keys.indexOf(properties[p]) !== -1) {
            newPerson[properties[p]] = person[properties[p]];
        }
    }

    return newPerson;
}

exports.select = function () {
    var properties = [].slice.call(arguments);

    return function select(collection) {
        var newCollection = [];
        collection.forEach(function (person) {
            newCollection.push(filterProperty(properties, person));
        });

        return newCollection;
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        return collection.filter(function (person) {
            return values.indexOf(person[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {

    return function sortBy(collection) {
        return collection.sort(function (person1, person2) {
            if (person1[property] === person2[property]) {
                return 0;
            }
            if (order === 'asc') {
                return person1[property] < person2[property] ? -1 : 1;
            }

            return person1[property] < person2[property] ? 1 : -1;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {

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
 * @returns {Function}
 */
exports.limit = function (count) {

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
