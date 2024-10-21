importScripts('js/sw-utils.js')

const STATIC_CACHE  = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'
const INMUTABLE_CACHE = 'inmutable-v1'

const APP_SHELL = [
    '/',
    'index.html',
    'js/app.js',
    'css/style.css',
    'img/favicon.ico',
    'img/avatar/hulk.jpg',
    'img/avatar/spiderman.jpg',
    'img/avatar/thor.jpg',
    'img/avatar/wolverine.jpg',
    'img/avatar/ironman.jpg'
]

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then( cache => 
        cache.addAll (APP_SHELL)
    )
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then( cache => 
        cache.addAll (APP_SHELL_INMUTABLE)
    )
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})

self.addEventListener('activate', e => {
    const respuesta = cache.keys().then (keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key)
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key)
            }
        })
    })
    e.waintUntil(respuesta)
})
self.addEventListener('fetch', e =>{
    const respuesta = caches.match(e.request).then(res => {
        if(res){
            return res
        }else{
            return fetch(e.request).then(newRes =>{
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            })
        }
    })
    e.respondWith(respuesta)
})