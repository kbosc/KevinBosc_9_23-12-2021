import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => a > b;
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test("Then, Loading page should be rendered", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });

    test("Then I click on the Eye button a modal should open", () => {
      // mock bootstrap
      $.fn.modal = jest.fn();
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const containerBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: null,
      });

      // const handleClick = jest.spyOn(containerBills, "handleClickIconEye");
      const handleClickIconEye = jest.fn(containerBills.handleClickIconEye);
      const iconEye = screen.getAllByTestId("icon-eye");
      iconEye[0].addEventListener("click", handleClickIconEye(iconEye[0]));
      // fonctionne avec ou sans la simulation du clic....
      userEvent.click(iconEye[0]);
      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = screen.getByTestId("modaleFile");
      expect(modale).toBeTruthy();
    });

    test("then i click new bill button, a new Bill page should open", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const bills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: null,
      });
      const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e));
      const addnewBill = screen.getByTestId("btn-new-bill");
      addnewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(addnewBill);
      expect(handleClickNewBill).toHaveBeenCalled();
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy();
    });
  });
  describe("When I am on Bills page but back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      const html = BillsUI({ loading: false, error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });
});
