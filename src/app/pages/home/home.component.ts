import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from "three"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("viewport") input!: ElementRef<HTMLInputElement>

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  public logo: any

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.y = 0.2
    this.camera.position.z = 1
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color("#0D63AE"))
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", this.onResize.bind(this), false)

    const loader = new GLTFLoader()
    loader.load("/assets/bbc.glb",
      (gltf: any) => {
        const logo = gltf.scene.children[0]
        this.logo = logo
        logo.material = new THREE.MeshPhysicalMaterial({ color: "#99C53C", roughness: 0.2 })
        this.scene.add(logo)
      }
    )

    const light = new THREE.DirectionalLight();
    const camera = this.camera
    light.position.set(camera.position.x, camera.position.y, camera.position.z)
    this.scene.add(light)
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private loop(now: number): void {
    requestAnimationFrame(this.loop.bind(this))
    this.logo.rotation.y -= 0.02
    this.renderer.render(this.scene, this.camera)
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.appendChild(this.renderer.domElement)
    this.loop(performance.now())
  }
}
