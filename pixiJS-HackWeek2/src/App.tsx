import { Application, extend, useApplication } from '@pixi/react';
import { AnimatedSprite, Assets, Container, Sprite, Texture } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Sprite,
  AnimatedSprite,
});

const BunnySprite = () => {
  const { app } = useApplication();

  // The Pixi.js `Sprite`
  const spriteRef = useRef<Sprite>(null);
  const [texture, setTexture] = useState(Texture.EMPTY);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load('/assets/bunny.png').then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!spriteRef.current) return;

      switch (event?.key) {
        case 'ArrowLeft':
          spriteRef.current.position.x -= 20;
          break;
        case 'ArrowRight':
          spriteRef.current.position.x += 20;
          break;
        case 'ArrowUp':
          spriteRef.current.position.y -= 20;
          break;
        case 'ArrowDown':
          spriteRef.current.position.y += 20;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // // Listen for animate update
  // useTick((ticker) => {
  //   if (!spriteRef.current) return;
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   spriteRef.current.rotation += 0.1 * ticker.deltaTime;
  // });

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  );
};

const SlimeSprite = () => {
  const { app } = useApplication();
  const [textures, setTextures] = useState([Texture.EMPTY]);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const spritesheet = await Assets.load(
          '/slime/forwardSlimeAnimation.json'
        );

        // This is typically how you extract an animation called "walk" or similar.
        // Check your .json for available animation names if unsure.
        const frames =
          spritesheet.animations['Slime1_Idle_full'] ??
          Object.values(spritesheet.textures);

        setTextures(frames);
      } catch (err) {
        console.error('Error loading animation:', err);
      }
    };

    loadAnimation();
  }, []);

  return (
    <pixiAnimatedSprite
      textures={textures}
      animationSpeed={1}
      anchor={0.5}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  );
};

export default function App() {
  return (
    <Application background={'#1099bb'} resizeTo={window}>
      <BunnySprite />
      <SlimeSprite />
    </Application>
  );
}
