export default (
    imgUrl='../globe/world_1.jpg',
    elvUrl='../globe/earth_elevation.jpg',
    wtrUrl='../globe/earth_water.png') => {
    /*eslint no-console: 0 */
    const _ = {
        sphereObject: null,
        onHover: {},
        onHoverVals: [],
    };

    function init() {
        this._.options.showGlobe = true;
    }

    function create() {
        const tj = this.threejsPlugin;
        if (!_.sphereObject) {
            const SCALE = this._.proj.scale();
            const earth_img = tj.texture(imgUrl);
            const elevt_img = tj.texture(elvUrl);
            const water_img = tj.texture(wtrUrl);
            const geometry  = new THREE.SphereGeometry(SCALE, 30, 30);
            const material  = new THREE.MeshPhongMaterial({
                map: earth_img,
                bumpMap: elevt_img,
                bumpScale: 0.01,
                specularMap: water_img,
                specular: new THREE.Color('grey')
            })
            _.sphereObject = new THREE.Mesh(geometry, material);
            _.sphereObject.name = _.me.name;
            if (this.threejsPlugin.domEvents) {
                this.threejsPlugin.domEvents.addEventListener(_.sphereObject, 'mousemove', function(event){
                    for (let v of _.onHoverVals) {
                        v.call(event.target, event);
                    }
                }, false);
            }
            const ambient= new THREE.AmbientLight(0x777777);
            const light1 = new THREE.DirectionalLight(0xffffff, 0.2);
            const light2 = new THREE.DirectionalLight(0xffffff, 0.2);
            light1.position.set(5, 3,  6);
            light2.position.set(5, 3, -6);
            tj.addGroup(ambient);
            tj.addGroup(light1);
            tj.addGroup(light2);
            tj.addGroup(_.sphereObject);
        } else {
            tj.addGroup(_.sphereObject);
        }
    }

    return {
        name: 'globeThreejs',
        onInit(me) {
            _.me = me;
            init.call(this);
        },
        onCreate() {
            create.call(this);
        },
        onHover(obj) {
            Object.assign(_.onHover, obj);
            _.onHoverVals = Object.keys(_.onHover).map(k => _.onHover[k]);
        },
        sphere() {
            return _.sphereObject;
        }
    }
}
