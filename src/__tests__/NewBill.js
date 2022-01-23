// import { screen } from "@testing-library/dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
// import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";
import { bills } from "../fixtures/bills";
// import { store as storeApi } from "./src/app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    ////////////////////////////////////////////// handChangeFile ////////////////////////////////
    describe("When I select a file through the file input", () => {
      test("Then the file name should be found in the input", async () => {
        const fileUrl = "image.jpg";
        // Set New Bill html
        const html = NewBillUI();
        document.body.innerHTML = html;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        class ApiEntityMock {
          async create({ data, headers = {} }) {
            return Promise.resolve({ fileUrl: fileUrl, key: 2 });
          }
        }

        class Storage {
          bills() {
            return new ApiEntityMock();
          }
        }

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@tld.com",
            password: "employee",
            status: "connected",
          })
        );

        const contentNewBill = new NewBill({
          document,
          onNavigate,
          store: new Storage(),
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("click", handleChangeFile);
        // fireEvent.click(inputFile);
        fireEvent.click(inputFile, {
          target: {
            files: [new File([fileUrl], fileUrl, { type: "image/jpg" })],
          },
        });
        expect(handleChangeFile).toBeCalled();
        await waitFor(() => expect(contentNewBill.fileUrl).toEqual(fileUrl));
      });
    });

    describe("When I select a wrong file through the file input", () => {
      test("Then placeholder is null", async () => {
        const fileUrl = "text.html";
        global.alert = jest.fn();
        // Set New Bill html
        const html = NewBillUI();
        document.body.innerHTML = html;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        class ApiEntityMock {
          async create({ data, headers = {} }) {
            return Promise.resolve({ fileUrl: fileUrl, key: 2 });
          }
        }

        class Storage {
          bills() {
            return new ApiEntityMock();
          }
        }

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@tld.com",
            password: "employee",
            status: "connected",
          })
        );

        const contentNewBill = new NewBill({
          document,
          onNavigate,
          store: new Storage(),
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("click", handleChangeFile);
        fireEvent.click(inputFile, {
          target: {
            files: [new File([fileUrl], fileUrl, { type: "text/html" })],
          },
        });
        expect(handleChangeFile).toBeCalled();
        await waitFor(() => expect(contentNewBill.fileUrl).toBeNull());
      });
    });

    describe("When I select a wrong file through the file input", () => {
      test("Then placeholder is null", async () => {
        const fileUrl = "image.jpg";
        // Set New Bill html
        const html = NewBillUI();
        document.body.innerHTML = html;
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        class ApiEntityMock {
          async create({ data, headers = {} }) {
            return Promise.reject("Erreur");
          }
        }
        class Storage {
          bills() {
            return new ApiEntityMock();
          }
        }
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@tld.com",
            password: "employee",
            status: "connected",
          })
        );
        const contentNewBill = new NewBill({
          document,
          onNavigate,
          store: new Storage(),
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("click", handleChangeFile);
        // fireEvent.click(inputFile);
        fireEvent.click(inputFile, {
          target: {
            files: [new File([fileUrl], fileUrl, { type: "image/jpg" })],
          },
        });
        expect(handleChangeFile).toBeCalled();
        await waitFor(() => expect(contentNewBill.fileUrl).toBeNull());
      });
    });

    //////////////////////////////////////////////////// handleSubmit ////////////////////////////////
    describe("When I fill in a correct form", () => {
      test("Then it should create a new bill and go back to Bills page", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const containerNewBill = new NewBill({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        });

        const handleSubmit = jest.spyOn(containerNewBill, "handleSubmit");

        const form = screen.getByTestId("form-new-bill");
        screen.getByTestId("expense-type").value = "Transports";
        screen.getByTestId("expense-name").value = "Train Paris-Marseille";
        screen.getByTestId("datepicker").value = "2022-01-15";
        screen.getByTestId("amount").value = "80";
        screen.getByTestId("vat").value = "70";
        screen.getByTestId("pct").value = "20";
        screen.getByTestId("commentary").value = "Seconde classe";
        containerNewBill.fileName = "test.png";
        containerNewBill.fileUrl = "https://test.com/test.png";

        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getByText(/mes notes de frais/i)).toBeTruthy();
      });
    });
    describe("When I fill in a correct form", () => {
      test("Then it should create a new bill and go back to Bills page", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const containerNewBill = new NewBill({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        });

        const handleSubmit = jest.spyOn(containerNewBill, "handleSubmit");

        const form = screen.getByTestId("form-new-bill");
        screen.getByTestId("expense-type").value = "Transports";
        screen.getByTestId("expense-name").value = "Train Paris-Marseille";
        screen.getByTestId("datepicker").value = "2022-01-15";
        screen.getByTestId("amount").value = "80";
        screen.getByTestId("vat").value = "70";
        screen.getByTestId("pct").value = "";
        screen.getByTestId("commentary").value = "Seconde classe";
        containerNewBill.fileName = "test.png";
        containerNewBill.fileUrl = "https://test.com/test.png";

        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getByText(/mes notes de frais/i)).toBeTruthy();
      });
    });
  });
});

// test d'intégration POST
describe("When I post a NewBill", () => {
  test("Then posting the NewBill from mock API POST", async () => {
    const getSpy = jest.spyOn(store, "post");
    const bills = await store.post();
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(bills.data).toBeTruthy();
  });
  test("fetches bills from an API and fails with 404 message error", async () => {
    store.post.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 404"))
    );
    const html = BillsUI({ error: "Erreur 404" });
    document.body.innerHTML = html;
    const message = await screen.getByText(/Erreur 404/);
    expect(message).toBeTruthy();
  });
  test("fetches message from an API and fails with 500 message error", async () => {
    store.post.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 500"))
    );
    const html = BillsUI({ error: "Erreur 500" });
    document.body.innerHTML = html;
    const message = await screen.getByText(/Erreur 500/);
    expect(message).toBeTruthy();
  });
});
