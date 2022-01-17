// import { screen } from "@testing-library/dom";
import { fireEvent, screen } from "@testing-library/dom";
// import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";
import { bills } from "../fixtures/bills";
import { store as storeApi } from "./src/app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    ////////////////////////////////////////////// handChangeFile ////////////////////////////////
    describe("When I select a file through the file input", () => {
      test("Then the file name should be found in the input", async () => {
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
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        // const store = jest.fn();
        // const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
        // console.log(bills);
        const html = NewBillUI();
        document.body.innerHTML = html;
        const contentNewBill = new NewBill({
          document,
          onNavigate,
          storeApi,
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("click", handleChangeFile);
        fireEvent.click(inputFile, {
          target: {
            files: [
              new File(["image.jpg"], "image.jpg", { type: "image/jpg" }),
            ],
          },
        });
        expect(handleChangeFile).toBeCalled();
        console.log("coucou");
        console.log(contentNewBill);
      });
    });
    //////////////////////////////////////////////////// handleSubmit ////////////////////////////////
    // describe("When I fill in a correct form", () => {
    //   test("Then it should create a new bill and go back to Bills page", () => {
    //     const html = NewBillUI();
    //     document.body.innerHTML = html;
    //     const onNavigate = (pathname) => {
    //       document.body.innerHTML = ROUTES({ pathname });
    //     };
    //     const containerNewBill = new NewBill({
    //       document,
    //       onNavigate,
    //       store: null,
    //       localStorage: window.localStorage,
    //       // localStorage: localStorageMock,
    //     });

    //     const handleSubmit = jest.spyOn(containerNewBill, "handleSubmit");
    //     // const handleSubmit = jest.fn(containerNewBill.handleSubmit);

    //     const form = screen.getByTestId("form-new-bill");
    //     screen.getByTestId("expense-type").value = "Transports";
    //     screen.getByTestId("expense-name").value = "Train Paris-Marseille";
    //     screen.getByTestId("datepicker").value = "2022-01-17";
    //     screen.getByTestId("amount").value = "80";
    //     screen.getByTestId("vat").value = "70";
    //     screen.getByTestId("pct").value = "20";
    //     screen.getByTestId("commentary").value = "Seconde classe";
    //     containerNewBill.fileName = "test.png";
    //     containerNewBill.fileUrl = "https://test.com/test.png";

    //     form.addEventListener("submit", handleSubmit);
    //     fireEvent.submit(form);

    //     expect(handleSubmit).toHaveBeenCalled();
    //     // expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    //     expect(screen.getByText(/mes notes de frais/i)).toBeTruthy();
    //   });
    // });
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
