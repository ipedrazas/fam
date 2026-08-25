# The hero photograph slot

The landing page currently opens on a black field with the title set large. That is a
legitimate design and it will not embarrass anybody — but a real photograph of the actual
room, with actual people in it, beats any graphic we could make.

## To add one

1. Drop the image into `src/images/` (create the folder), e.g. `src/images/room.jpg`.
   Landscape, at least 1800px wide. It will be darkened behind the type, so a slightly
   underexposed frame with some light in it works better than a bright, busy one.
2. In `src/pages/index.astro`:

   ```astro
   import room from '../images/room.jpg';
   ...
   <TitleCard
     line="Everyone here makes things. Nobody here agrees about this."
     photo={room}
     photoAlt="A full room at kollectiv, lit by a projector, people watching from folding chairs."
   />
   ```

3. Write real alt text. Not "hero image".

The photo is placed behind the type at 55% opacity with a scrim over it, so faces are
soft — but people in it should still have been asked. See the code of conduct.
