
import joystick from 'nipplejs'

AFRAME.registerComponent("joystick", {
    dependencies: ["animation-mixer"],

    init() {
        this.joystickEle = document.createElement("div")
        this.joystickEle.style.position = "absolute"
        this.joystickEle.style.width = "100px"
        this.joystickEle.style.height = "100px"
        this.joystickEle.style.bottom = "40px"
        this.joystickEle.style.left = "40px"
        document.body.append(this.joystickEle)
        this.onJoystickMove = this.onJoystickMove.bind(this)
        this.onJoystickEnd = this.onJoystickEnd.bind(this)
        this.joystick = joystick.create({
            zone: this.joystickEle,
            mode: "static",
            color: "tomato",
            position: {
                left: '50%',
                top: '50%'
            }
        })
        this.joystick.on("move", this.onJoystickMove)
        this.joystick.on("end", this.onJoystickEnd)
        this.rotation = 0;
        this.el.setAttribute("animation-mixer", {clip: "rig|Idle"})
        this.speed = 0
    },

    onJoystickMove(_, data) {
        this.rotation = data.angle.radian + ((90 * Math.PI) / 180)
        this.el.setAttribute("animation-mixer", {clip: "rig|WalkCycle"})
        this.speed = 0.6
    },

    onJoystickEnd() {
        this.el.setAttribute("animation-mixer", {clip: "rig|Idle"})
        this.speed = 0
        console.log("end")
    },

    tick(time, fps) {
        (this.el.object3D as THREE.Object3D).setRotationFromEuler(new THREE.Euler(0, this.rotation, 0, "XYZ"));
        const rawVel = new THREE.Vector3(
            Math.cos(0) * Math.sin(this.rotation), 
            Math.sin(0) * Math.sin(this.rotation), 
            Math.cos(this.rotation)
        )
        .normalize()
        .multiplyScalar(this.speed)
        .multiplyScalar(fps / 1000);

        (this.el.object3D as THREE.Object3D).position.add(
            rawVel
            
        )
    },

    remove() {
        this.joystick.destroy()
        this.joistickEle.remove()
    }

})
