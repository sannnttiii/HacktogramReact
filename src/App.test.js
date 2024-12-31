import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";

import App from "./App";
import { MemoryRouter } from "react-router";

jest.mock("@chakra-ui/react", () => {
  const actualChakra = jest.requireActual("@chakra-ui/react");
  const {
    SimpleGrid,
    Box,
    Button,
    Heading,
    Text,
    Textarea,
    Image,
    Link,
    Input,
    Container,
    Flex,
    FormControl,
    FormLabel,
    VStack,
  } = actualChakra;
  return {
    ...actualChakra,
    SimpleGrid: ({ children, ...props }) => (
      <SimpleGrid className="test-simple-grid" {...props}>
        {children}
      </SimpleGrid>
    ),
    Box: ({ children, ...props }) => (
      <Box {...props} className={"test-box " + props.className}>
        {children}
      </Box>
    ),
    Button: ({ children, ...props }) => (
      <Button {...props} className={"test-button " + props.className}>
        {children}
      </Button>
    ),
    Heading: ({ children, ...props }) => (
      <Heading {...props} className={"test-heading " + props.className}>
        {children}
      </Heading>
    ),
    Text: ({ children, ...props }) => (
      <Text {...props} className={"test-text " + props.className}>
        {children}
      </Text>
    ),
    Textarea: ({ children, ...props }) => (
      <Textarea {...props} className={"test-textarea " + props.className}>
        {children}
      </Textarea>
    ),
    Image: ({ children, ...props }) => (
      <Image
        {...props}
        role="test-image"
        className={"test-image " + props.className}
      >
        {children}
      </Image>
    ),
    Link: ({ children, ...props }) => (
      <Link {...props} className={"test-link " + props.className}>
        {children}
      </Link>
    ),
    Input: ({ children, ...props }) => (
      <Input {...props} className={"test-input " + props.className}>
        {children}
      </Input>
    ),
    Container: ({ children, ...props }) => (
      <Container {...props} className={"test-container " + props.className}>
        {children}
      </Container>
    ),
    Flex: ({ children, ...props }) => (
      <Flex {...props} className={"test-flex " + props.className}>
        {children}
      </Flex>
    ),
    FormControl: ({ children, ...props }) => (
      <FormControl
        {...props}
        className={"test-form-control " + props.className}
      >
        {children}
      </FormControl>
    ),
    FormLabel: ({ children, ...props }) => (
      <FormLabel {...props} className={"test-form-label " + props.className}>
        {children}
      </FormLabel>
    ),
    VStack: ({ children, ...props }) => (
      <VStack {...props} className={"test-vstack " + props.className}>
        {children}
      </VStack>
    ),
  };
});

let originalFetch = global.fetch;

global.fetch = jest.fn();

function renderWithInitialEntries(initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  fetch.mockClear();
});

describe("Home", () => {
  describe("When user is not signed in", () => {
    it("should navigate to sign in page", async () => {
      Storage.prototype.getItem = jest.fn(() => null);

      const { container } = renderWithInitialEntries(["/"]);

      const signinPage = await container.querySelector(".signin-page");
      expect(signinPage).toBeInTheDocument();
    });
  });
  describe("When user is signed in", () => {
    beforeEach(() => {
      const user = {
        id: "1",
        username: "djarotpurnomo",
        fullname: "Djarot Purnomo",
        desc: "Admin User",
        profilePic: "https://images.unsplash.com/photo-1544642058-1f01423e7a16",
      };

      Storage.prototype.getItem = jest.fn(() => JSON.stringify(user));
    });
    it("should render required buttons", async () => {
      renderWithInitialEntries(["/"]);

      const homeButton = await screen.getByText(/Home/i);
      expect(homeButton).toBeInTheDocument();

      const createButton = await screen.getByText(/Create/i);
      expect(createButton).toBeInTheDocument();

      const logoutButton = await screen.getByText(/Log Out/i);
      expect(logoutButton).toBeInTheDocument();
    });

    it("should render Photo component immediately", async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockedPhotos),
      });

      const { container } = renderWithInitialEntries(["/"]);
      const imageTemplate = Array.from(
        container.querySelectorAll(".photo-loading-template")
      );

      expect(screen.getByText("djarotpurnomo")).toBeInTheDocument();
      expect(screen.getByText("Djarot Purnomo")).toBeInTheDocument();
      expect(screen.getByText("Admin User")).toBeInTheDocument();
      expect(imageTemplate.length).toBeGreaterThan(0);

      await waitFor(async () => {
        expect(await screen.getAllByRole("test-image").length).toBeGreaterThan(
          0
        );

        expect(
          await screen.getByAltText("A lady free diving")
        ).toBeInTheDocument();
      });

      expect(fetch).lastCalledWith(
        expect.stringMatching(/^http:\/\/localhost:3001\/photos/)
      );
    });

    it("should navigate to create page when create button is clicked", async () => {
      const { container } = renderWithInitialEntries(["/"]);

      const createButton = screen.getByTestId("create-button");

      fireEvent.click(createButton);

      await waitFor(async () => {
        await expect(
          container.querySelector(".create-photo-page")
        ).toBeInTheDocument();
      });
    });

    it("should delete local storage and navigate to sign in when log out button is clicked", async () => {
      Storage.prototype.removeItem = jest.fn();

      const { container } = renderWithInitialEntries(["/"]);
      const logoutButton = screen.getByTestId("logout-button");

      fireEvent.click(logoutButton);
      expect(Storage.prototype.removeItem).toBeCalledWith("user");

      await waitFor(async () => {
        await expect(
          screen.queryByText("djarotpurnomo")
        ).not.toBeInTheDocument();
      });

      const signinPage = await container.querySelector(".signin-page");
      expect(signinPage).toBeInTheDocument();
    });
  });
});

describe("Sign In", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should render signin page", async () => {
    const { container } = renderWithInitialEntries(["/signin"]);

    const signinPage = await container.querySelector(".signin-page");
    expect(signinPage).toBeInTheDocument();
  });
  it("should render required input fields", async () => {
    renderWithInitialEntries(["/signin"]);

    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("signin-button")).toBeInTheDocument();
  });

  it("should contain minimum Username and Password with ChakraUI Input Component", async () => {
    const { container } = renderWithInitialEntries(["/signin"]);

    const pageInput = container.querySelectorAll(".test-input");
    expect(pageInput.length).toEqual(2);
  });
  it("should navigate to home page when user sign in successfully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockedUsers),
    });

    renderWithInitialEntries(["/signin"]);

    const usernameInput = screen.getByTestId("username");
    const passwordInput = screen.getByTestId("password");
    const signinButton = screen.getByTestId("signin-button");

    fireEvent.change(usernameInput, { target: { value: "kirana" } });
    fireEvent.change(passwordInput, { target: { value: "kirana1234" } });
    fireEvent.click(signinButton);

    const lastCall = fetch.mock.lastCall;
    expect(lastCall[0]).toBe("http://localhost:3001/users");

    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        username: "kirana",
        id: "1",
        fullname: "Kirana Islamadina",
        desc: "Hi! I'm Kirana",
        profilePic:
          "https://images.unsplash.com/photo-1464446066817-4116494586bb",
      })
    );

    await waitFor(async () => {
      expect(await screen.getByText("kirana")).toBeInTheDocument();
      expect(await screen.getByText("Kirana Islamadina")).toBeInTheDocument();
      expect(await screen.getByText("Hi! I'm Kirana")).toBeInTheDocument();

      expect(window.location.pathname).toBe("/");
    });
  });
});

describe("Register", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should render register page", async () => {
    const { container } = renderWithInitialEntries(["/register"]);

    const registerPage = await container.querySelector(".register-page");
    expect(registerPage).toBeInTheDocument();
  });
  it("should render required input fields", async () => {
    renderWithInitialEntries(["/register"]);

    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("fullname")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByTestId("profile-picture")).toBeInTheDocument();
    expect(screen.getByTestId("register-button")).toBeInTheDocument();
  });

  it("should contain all required fields with ChakraUI Input Component", async () => {
    const { container } = renderWithInitialEntries(["/register"]);

    const pageInput = container.querySelectorAll(".test-input");
    expect(pageInput.length).toEqual(5);
  });
  it("should navigate to home page when user register successfully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockedUsers),
    });

    renderWithInitialEntries(["/register"]);

    const usernameInput = screen.getByTestId("username");
    const passwordInput = screen.getByTestId("password");
    const fullnameInput = screen.getByTestId("fullname");
    const descInput = screen.getByTestId("description");
    const profilePicInput = screen.getByTestId("profile-picture");
    const registerButton = screen.getByTestId("register-button");

    fireEvent.change(usernameInput, { target: { value: "siudin" } });
    fireEvent.change(passwordInput, { target: { value: "siudin1234" } });
    fireEvent.change(fullnameInput, { target: { value: "Udin Penyok" } });
    fireEvent.change(descInput, { target: { value: "HAHAAAAAY!" } });
    fireEvent.change(profilePicInput, {
      target: {
        value: "https://images.unsplash.com/photo-1463453091185-61582044d556",
      },
    });
    fireEvent.click(registerButton);

    global.fetch.mockResolvedValue({
      json: () =>
        Promise.resolve([
          ...mockedUsers,
          {
            id: "2",
            username: "siudin",
            password: "siudin1234",
            fullname: "Udin Penyok",
            desc: "HAHAAAAAY!",
            profilePic:
              "https://images.unsplash.com/photo-1463453091185-61582044d556",
          },
        ]),
    });

    const lastCall = fetch.mock.lastCall;
    expect(lastCall[0]).toBe("http://localhost:3001/users");

    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: "2",
        username: "siudin",
        fullname: "Udin Penyok",
        desc: "HAHAAAAAY!",
        profilePic:
          "https://images.unsplash.com/photo-1463453091185-61582044d556",
      })
    );

    await waitFor(async () => {
      expect(await screen.getByText("siudin")).toBeInTheDocument();
      expect(await screen.getByText("Udin Penyok")).toBeInTheDocument();
      expect(await screen.getByText("HAHAAAAAY!")).toBeInTheDocument();

      expect(window.location.pathname).toBe("/");
    });
  });
});

describe("Photos", () => {
  beforeEach(() => {
    const user = {
      id: "2",
      username: "kirana",
      fullname: "Kirana Islamadina",
      desc: "Hi! I'm Kirana",
      profilePic:
        "https://images.unsplash.com/photo-1464446066817-4116494586bb",
    };

    Storage.prototype.getItem = jest.fn(() => JSON.stringify(user));
  });

  it("should render Photo component", async () => {
    const { container } = renderWithInitialEntries(["/"]);
    expect(container.querySelector(".photo-page")).toBeInTheDocument();
  });

  it("should render user profile", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve(mockedPhotos.filter((photo) => photo.userId === "2")),
    });

    renderWithInitialEntries(["/"]);

    expect(screen.getByText("kirana")).toBeInTheDocument();
    expect(screen.getByText("Kirana Islamadina")).toBeInTheDocument();
    expect(screen.getByText("Hi! I'm Kirana")).toBeInTheDocument();

    await waitFor(async () => {
      await expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("should render all photos owned by the signed in user based on the userId data of each photo", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve(mockedPhotos.filter((photo) => photo.userId === "2")),
    });

    const { container } = renderWithInitialEntries(["/"]);
    const imageTemplate = Array.from(
      container.querySelectorAll(".photo-loading-template")
    );
    expect(imageTemplate.length).toBeGreaterThan(0);

    await waitFor(async () => {
      expect(await screen.getAllByRole("test-image").length).toBeGreaterThan(0);

      expect(
        await screen.getByAltText("Tibumana Waterfall, Indonesia")
      ).toBeInTheDocument();
    });

    expect(fetch).lastCalledWith(
      expect.stringMatching(/^http:\/\/localhost:3001\/photos/)
    );
  });
});

describe("Create", () => {
  beforeEach(() => {
    const user = {
      id: "2",
      username: "kirana",
      fullname: "Kirana Islamadina",
      desc: "Hi! I'm Kirana",
      profilePic:
        "https://images.unsplash.com/photo-1464446066817-4116494586bb",
    };

    Storage.prototype.getItem = jest.fn(() => JSON.stringify(user));
  });
  it("should render Create component", async () => {
    const { container } = renderWithInitialEntries(["/create"]);

    expect(container.querySelector(".create-photo-page")).toBeInTheDocument();
  });

  it("should render required input fields", async () => {
    renderWithInitialEntries(["/create"]);

    expect(screen.getByTestId("photo-url")).toBeInTheDocument();
    expect(screen.getByTestId("caption")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
  });

  it("should upload photo when upload button is clicked then redirect to home", async () => {
    renderWithInitialEntries(["/create"]);

    const urlInput = screen.getByTestId("photo-url");
    const captionInput = screen.getByTestId("caption");
    const uploadButton = screen.getByTestId("upload-button");

    fireEvent.change(urlInput, {
      target: {
        value: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
      },
    });
    fireEvent.change(captionInput, {
      target: { value: "Getting dressed for interview" },
    });
    fireEvent.click(uploadButton);

    const lastCall = fetch.mock.lastCall;
    expect(lastCall[0]).toBe("http://localhost:3001/photos");
    expect(lastCall[1].method).toBe("POST");
    expect(lastCall[1].headers["Content-Type"]).toBe("application/json");
    const body = JSON.parse(lastCall[1].body);
    expect(body.url).toBe(
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891"
    );
    expect(body.caption).toBe("Getting dressed for interview");
    expect(body.userId).toBe("2");

    global.fetch.mockResolvedValue({
      json: () =>
        Promise.resolve([
          ...mockedPhotos.filter((photo) => photo.userId === "2"),
          {
            id: "a32f",
            caption: "Getting dressed for interview",
            url: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
            userId: "2",
          },
        ]),
    });
  });
});

describe("Detail", () => {
  beforeEach(() => {
    const user = {
      id: "2",
      username: "kirana",
      fullname: "Kirana Islamadina",
      desc: "Hi! I'm Kirana",
      profilePic:
        "https://images.unsplash.com/photo-1464446066817-4116494586bb",
    };

    Storage.prototype.getItem = jest.fn(() => JSON.stringify(user));

    global.fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          id: "b9b4",
          url: "https://images.unsplash.com/photo-1576511294595-d1731bea8fbf",
          caption:
            "Photo of a street with a wall full of graffiti, wall paintings of a painted cat, parked bicycles and urban writings in Amsterdam city. This are building walls of old former fabrique halls, with sharp contrasts between sunlight and shadows. I like the spontaneous combination of all these images together, including the written texts on the walls. Free images of urban street photography by Fons Heijnsbroek, October 2016, The Netherlands.",
          userId: "2",
        }),
    });
  });

  it("should render photo detail page by photo id", async () => {
    const { container } = renderWithInitialEntries(["/photo/b9b4"]);

    await act(async () => {
      //to remove warning message
    });

    expect(container.querySelector(".detail-photo-page")).toBeInTheDocument();
  });

  it("should render user profile data like profile picture, username and display user photo detail and photo caption and detele button", async () => {
    renderWithInitialEntries(["/photo/b9b4"]);

    const caption =
      "Photo of a street with a wall full of graffiti, wall paintings of a painted cat, parked bicycles and urban writings in Amsterdam city. This are building walls of old former fabrique halls, with sharp contrasts between sunlight and shadows. I like the spontaneous combination of all these images together, including the written texts on the walls. Free images of urban street photography by Fons Heijnsbroek, October 2016, The Netherlands.";

    await waitFor(async () => {
      await expect(screen.getByText("kirana")).toBeInTheDocument();
      await expect(screen.getByText(caption)).toBeInTheDocument();
      await expect(await screen.getAllByRole("test-image").length).toEqual(2);
      await expect(screen.getByAltText(caption)).toBeInTheDocument();
      await expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    });
  });

  it("should delete photo when delete button is clicked", async () => {
    renderWithInitialEntries(["/photo/b9b4"]);

    const deleteButton = await screen.findByTestId("delete-button");

    fireEvent.click(deleteButton);

    const lastCall = fetch.mock.lastCall;
    expect(lastCall[0]).toBe("http://localhost:3001/photos/b9b4");
    expect(lastCall[1].method).toBe("DELETE");
    expect(lastCall[1].headers["Content-Type"]).toBe("application/json");
  });
});

describe("Not Found", () => {
  it("should show a 404 page", async () => {
    renderWithInitialEntries(["/bad-routes"]);
    await waitFor(() => screen.findByText(/Not Found/));
  });

  it("should contain a ChakraUI Button Component", async () => {
    const { container } = renderWithInitialEntries(["/bad-routes"]);
    await waitFor(() =>
      expect(container.querySelector(".test-button")).toBeTruthy()
    );
  });
});

const mockedUsers = [
  {
    id: "1",
    username: "kirana",
    password: "kirana1234",
    fullname: "Kirana Islamadina",
    desc: "Hi! I'm Kirana",
    profilePic: "https://images.unsplash.com/photo-1464446066817-4116494586bb",
  },
];

const mockedPhotos = [
  {
    id: "1",
    caption: "A lady free diving",
    url: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae",
    userId: "1",
  },
  {
    id: "2",
    caption: "Free diver swims with a school of fish",
    url: "https://images.unsplash.com/photo-1602199926649-2e5e447bab97",
    userId: "1",
  },
  {
    id: "3",
    caption: "Beautiful View of Waterfall 🥀✨",
    url: "https://images.unsplash.com/photo-1720884413532-59289875c3e1",
    userId: "1",
  },
  {
    id: "4",
    caption: "Early morning and lockdown.",
    url: "https://images.unsplash.com/photo-1590800752883-6446fe1d3da6",
    userId: "1",
  },
  {
    id: "a32f",
    caption: "Tibumana Waterfall, Indonesia",
    url: "https://images.unsplash.com/photo-1520936113839-69b3b2475037",
    userId: "2",
  },
  {
    id: "b9b4",
    url: "https://images.unsplash.com/photo-1576511294595-d1731bea8fbf",
    caption:
      "Photo of a street with a wall full of graffiti, wall paintings of a painted cat, parked bicycles and urban writings in Amsterdam city. This are building walls of old former fabrique halls, with sharp contrasts between sunlight and shadows. I like the spontaneous combination of all these images together, including the written texts on the walls. Free images of urban street photography by Fons Heijnsbroek, October 2016, The Netherlands.",
    userId: "2",
  },
];

jest.setTimeout(45000);
