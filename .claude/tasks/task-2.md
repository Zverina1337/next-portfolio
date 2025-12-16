# Task 2 - implementation of the projects page

Your task is to implement the project page using ready-made components and, as necessary, implement new ones, namely, to implement an orchestrator component that will include all the logic of displaying the elements presented in the list of components.

### Functionality
1. **Requests**: Makes requests and reads the local file of projects described in json. It must be implemented on SSR (layout.tsx) to increase productivity. 
2. **ProjectList display**: passing data to this component. CSR only (page.tsx).
3. ****

## Page structure:
1. **Table of Contents (List of projects)** - are located at the very top of the page.
2. **Filtering and search** are located on the left in their aside.
3. **List of projects** - the first 4-5 items are located on the right, after which you need to scroll below to draw the next projects.

## Page Components:
1. **ProjectList**: A component of the project list, which consists of a ProjectItem. Displays a list of projects.
2. **ProjectItem**: A component of a separate project list item. Displays the basic information of the project.
3. **ProjectFilters**: A component that includes filtering capable of scaling. Displays the filtering of projects.
4. **ProjectSearch**: A component that implements project search by name, like Google Search. Displays the project search input.


## ProjectList - implementation details.

Your task is to create a component of the project list that will display each project, it should handle the following states:
1. **Loading**: come up with your own UI for the loader component, it is important that it fits into the style of the entire project.
2. **Empty**: Make a 3D element that will show that the list is empty.
3. **Error**: should be rendered only if an error occurred when displaying the list of projects.
4. **Success loaded**: Renders a successfully loaded list of ProjectItem components.
Keep in mind that this is just an orchestrator component, it just shows a specific UI depending on whether the data was sent to it in props or not.

## ProjectItem - implementation details.

## Key features of the page
1. **Table of Contents**: Just a text summarizing what we are on the project list page.
2. **Filtering**: the ability to search for the desired project by the name or technology on which the project was written.
3. **Project List**: A list consisting of brief information about the project.
4. **Infinite scroll loading**: implementation of data output from the json file containing all projects when intersecting the IntersectionObserver.

## ProjectFilters - implementation details.

Your task is to implement the filtering component of the project list:
1. By technology;
2. Commercial or pet project;
3. Date of implementation;
4. Is it available for sale.

## ProjectSearch - implementation details.

Your task is to implement the component of the project search by name, using the technology with which this project was written.