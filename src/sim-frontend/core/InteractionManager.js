export class InteractionManager {
    constructor(state, canvas, viewport, pointer) {
        this.state = state;
        this.canvas = canvas;
        this.viewport = viewport;
        this.pointer = pointer;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    handleMouseDown(e) {
        this.state.isDragging = true;
        this.viewport.entityToTrack = null;
        this.canvas.style.cursor = 'grabbing';
        this.viewport.setPan(e.clientX, e.clientY)
    }

    handleMouseUp(e) {
        this.state.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }

    handleMouseMove(e) {
        this.updatePointer(e.clientX, e.clientY);
        if (this.state.isDragging) {
            this.viewport.panViewport(e.clientX, e.clientY);
        } else {
            this.canvas.style.cursor = 'grab';
        }
    }

    handleWheel(e) {
        e.preventDefault();
        this.canvas.style.cursor = e.deltaY > 0 ? 'zoom-out' : 'zoom-in';
        this.viewport.zoomViewport(e.deltaY, e.clientX, e.clientY);
    }

    updatePointer(clientX = null, clientY = null) {
        const {x, y} = this.viewport.position.getPosition();
        this.pointer.updatePosition(x, y, clientX, clientY)
    }

    attachListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('wheel', this.handleWheel);
    }
}