# AI-Hackathon

![Angular Build Status](https://github.com/spfncer/AI-Hackathon/actions/workflows/main.yml/badge.svg?event=push)

This is our project, wow!

## Backend

To run the backend, navigate to `\backend` directory, then run `pip install -r requirements.txt` to 
install all dependencies. 

Then use the command `uvicorn main:app --port 3000` to start the backend server locally. 

Requires Python v3.8.10 & PIP 20.0.2

## Frontend

To run the frontend, navigate to the `\frontend\AI-Hackathon` directory, then run `npm install`.
This will install all node module dependencies. Then run `npm run start` and nivagate to `localhost:4200` to view the app.

Now, utilize the following commands to perform different actions:
1. `npm run start` - begin the angular app in development mode with hot module reloading
2. `npm run docs` - generate the docs and serve the html documentation with hot module reloading
3. `npm run test` - run unit tests in chrome in a browser window with hot module reloading
4. `npm run test:ci` - run unit tests in a headless browser
5. `npm run build` - build the angular project

The angular frontend uses Karma for unit testing, and compodoc for automatic code documentation. 
## Inspiration
Seeing the advances in large language models over the last years, we wanted to push the boundaries of what’s possible. We’ve all had bad experiences with sales associates and unhelpful “chat bots” and knew we could work to change those norms -- creating a new standard of customer experience and service that runs 24/7.

## What it does
Our application has a wide variety of features that can help with Verizon sales by identifying helpful services and features of the company that can appeal to both new and existing customers. First off, our app utilizes an AI chatbot for the user to be able to ask whatever question they may have about Verizon plans and features in order to sell the company's products. There is both a voice and text option, so the user can very easily ask the AI a question without the need of typing it out. This can be incredibly helpful, for people that have vision impairments or difficulty typing. Since the bot responds by talking to you, there is no need to read long responses either. For users that prefer texting, there is a chatbox option as well. 

A key feature of VIVA is a 3D rendered model that actually moves! We believe that this is very important to enhancing the user's experience as it aids with brand representation because the customizable avatar can be used to represent a brand’s identity, which reinforces brand recognition. It also makes the whole experience memorable for the customer to build on their perceptions of Verizon. 

## How we built it
VIVA runs on a client-server architecture. The client side is an Angular application, which renders the model and interprets user input. The server runs FastAPI for Python, and handles requests to the OpenAI language model and the Azure text-to-speech service.

A typical interaction begins with VIVA introducing itself, and listening to the user’s initial request. Once interpreted, it sends the customer’s question to the server. The server then sends the request to OpenAI, and collects its response. The response is sent to Azure for speech generation before the audio is returned to the client — and VIVA speaks its response.

## Challenges we ran into
We ran into quite a few issues throughout the development of this web application. The most notable of which was getting the Avatar model to be able to move and visually appear to be speaking to the user. In order to overcome this obstacle, we were able to use a combination of Azure AI’s facial position software and Three.js in order to create not only the render of the three dimensional model, but also the animations of the facial movement. Another challenge that we ran into was getting the language model to give concise, accurate responses. At first, its responses would be long blocks of text, mostly containing other questions instead of answers. We resolved this issue by using a different language model and by “cutting down” the answer with Python code.

## Accomplishments that we're proud of
We were able to create a working model of a website that does exactly what we set out to do, with very little prior knowledge on the topic. We could not be more proud that we were able to create an AI chatbot that can have a real voice conversation with anybody with an internet connection in order to sell them on Verizon products. This project was a lot of fun to work on for everybody involved and it was an amazing experience. 

## What we learned
On the technical side, we learned a lot about artificial intelligence APIs offered by leading providers and how to bring them together to create a cohesive product.
On the non-technical side, this project served as a great starting point for learning how the technologies we create represent a brand. One of our group members, Spencer, is studying PR so we were able to learn from his experiences too.
Furthermore, we also learned from our group member Theodore about how these products can advance the business interests of a company like Verizon. AI tools come with great potential to boost sales through finding solutions tailored to a customer, which was our goal in this project. 


## What's next for VIVA
We want VIVA to be the face of Verizon's online sales. First off, using the model that we have created, if we had access to more of Verizon’s data as well as their accounts, then this chatbot will be able to give customized responses and information based off of their data with the company. For instance, if a long-time customer asks “What phone should I buy next?”, it would be able to provide them with the optimal response based on their purchase history and price range. Another thing that we would be able to do with more data from Version, is we could make this chatbot able to aid in IT and troubleshooting various devices and systems. This would vastly expand the versatility of the application and give the customers a 24/7, reliable service to help them with frustrating technical problems. Lastly, VIVA could display a digital globe that shows the exact locations of where service outages have occurred, or where service is not supported. This would be helpful for people going on a remote trip where they may or may have service to be able to make phone calls and they can plan accordingly.
