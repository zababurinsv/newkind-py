import isEmpty from "./modules/isEmpty/isEmpty.mjs";
import parser from './modules/bem/bemParser.mjs'
export default (debug = true, doc = document.body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let object = {}
            object.obj = {}
            object.params = {}
            object.params.debug = debug
            let ID = doc.querySelectorAll("[id]")
            let CLASS = doc.querySelectorAll("[class]")
            object.obj = await parser(object.obj, ID, {type: 'id'})
            object.obj = await parser(object.obj, CLASS, {type: 'class'})
            resolve(new Proxy(object.obj,{
                get: (obj, prop) => {
                    if(object.params.debug) {
                        console.log({
                            _:'proxy get',
                            prop:prop,
                            obj:obj,
                            value:obj[prop]
                        })
                    }
                    return obj[prop];
                },
                set: (obj, prop, value) => {
                    if(object.params.debug) {
                        console.log({
                            _:'proxy set',
                            prop:prop,
                            obj:obj,
                            value:value
                        })
                    }
                    if(isEmpty(obj[prop])){
                        obj[prop] = []
                    }
                    obj[prop] = value;
                    return true
                }}))
        } catch (e) {
            resolve({
                message: e.message,
                success: true,
                status: true
            })
        }
    })
}