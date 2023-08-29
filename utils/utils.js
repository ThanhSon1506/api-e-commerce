'use strict'

class Utils {
    constructor() {

    }

    // convert nhieu array tro thanh mot array
    // console.log(utils.combineArray([123], [1234], ['a'], ['b'])) // return [123, 1234, "a", "b"]
    combineArray(...arrays) {
        return [].concat(...arrays)
    }

    //Loại bỏ những giá trị khong phu hop trong array
    // console.log(utils.compactArray(['', 0,  3, false, 6, 8, -1])) // return [3, 6, 8, -1]
    compactArray(arr) {
        return arr.filter(Boolean);
    }

    //Tim item trong array return true, false
    // console.log(utils.containsArray(['1', 3, false, 6, 8, -1, 'anony'], 'anony')) // return true
    containsArray(arr, value) {
        return Array.prototype.includes ? arr.includes(value) : arr.some(el => el === value)
    }

    // tim nhung item khong co trong array khac
    // console.log(utils.differenceArray([1,2,4,6], [1,2,8], [4,9]))// return 6 
    differenceArray(arr, ...others) {
        let combined = this.combineArray(...others) // su dung lai func combine
        return arr.filter(el => !combined.some(exclude => el === exclude))
    }

    // add nhieu object thanh mot object moi
    // console.log(utils.mergeObject({ type: "blog" }, { name: "test.com" })) //return {type: "blog", name: "test.com"}
    mergeObject(...objects) {
        const extend = Object.assign ? Object.assign : (target, ...sources) => {
            sources.forEach(source =>
                Object.keys(source).forEach(prop => target[prop] = source[prop])
            )
            return target;
        }
        return extend({}, ...objects);
    }
    //return mot array bao gom nhung giatri, tu mot object
    // console.log(utils.getValuesObject({type: 'blog', name: 'test.com'})) // return ["blog", "test.com"]

    getValuesObject(obj) {
        return Object.keys(obj).map(key => obj[key]);
    }
}
