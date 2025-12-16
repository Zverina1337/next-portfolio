# Task 1 - error correction

Your task is to fix the list of bugs and improvements, it is important that all of them are solved using Best Practices and using the documentation from Context7. Perform tasks from top to bottom, by numbering. The list contains a brief description of the task, below is a full description of each task by point.

## Task list:
1. **Navigation**: It is necessary to redesign the UI for mobile and desktop site navigation.
2. **3D Sphere**: Refinement of the sphere on the main page ("/").
3. **ContactBlock**: It is necessary to redo the block in terms of UI/UX, it is important that threejs-review skills are followed.
4. **AboutMe page**: Redesign the UI, statistics In the skills block need to be flipped to ThreeJS blocks.
5. **Optimization**: Check and maximize the optimization of the entire project.


## Navigation Task

Your task is to redesign the current navigation implementation so that the navigation list is displayed on the computer, and when the viewport is reduced, the pages, starting from tablets, turn into a single Menu button with the current visual implementation. 

Navigation on the computer should look like navigation in the ContactBlock block of the main page, it is important that the visual animations remain the same.

### Steps for completing the Navigation Task
1. Find the ContactNavigation component.
2. Redo it to a more reusable implementation without the mandatory separator.
3. Move from the local ContactBlock component to the reused components of the project.
4. Remove the carousel from the RunningLine element, rename it to "AvailableElement", now this component will show an animation of the glow of a blue circle in it. And also just that I'm available for work.
5. Implement the contact me button component, it is important that it looks like it uses visual animation when hovering and clicking, without problems with a11y.
6. Replace the "Menu" button with the Contact me button.
7. Add adaptive navigation.
8. Provide me with options for possibly increasing the UI/UX performance of my navigation (At least 3). For example, here are 3 elements that could be added without overloading the visual.


Provide an opportunity to test and verify as soon as you are done with this task, only after you have passed the type-check, checked the optimization, and after my visual check, proceed to the next task.

## 3D Sphere Task

Your task is to realize the UX pleasant effect of twisting the sphere. That is, to add smoothness when releasing the sphere with the left mouse button. 

### Steps for completing the 3D Sphere Task
1. Realize the pleasant effect of rotating the sphere when releasing the left mouse button.
2. Let me test the implementation, after my positive response, proceed to the next step.
3. Remove the ability to rotate the sphere on a mobile device.

## ContactBlock Task

Your task is to redesign the ContactBlock visually, namely, to redesign the mobile layout to match the standard of other blocks so that the edges of the block do not touch the edges of the phone, and also so that it has the same block size on the computer as the rest of the blocks on the main page.

## AboutMe page Task

Your task is to change the skill block on the "About Me" page, turning it into a list of 3D blocks with skill logos. You don't need to make them visually large, the most important thing is to have any 3D animation when you hover.

## Optimization Task

Your task is to check the optimization of the entire application and try to solve the main problems. Use /optimization-review.


If you have any questions during the course of completing tasks, ask them as you complete them.