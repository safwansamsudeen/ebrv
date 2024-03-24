// Copyright (c) 2024, Safwan Samsudeen and contributors
// For license information, please see license.txt

frappe.ui.form.on("Annexure Delivery Location", {
	refresh(frm) {
		frappe.db
			.get_list("Delivery Challan", {
				filters: { delivery_location: frm.doc.name },
			})
			.then((docs) => {
				if (!docs.length) {
					frm.add_custom_button("Raise Delivery Challan", () => {
						const newDoc = frappe.model.make_new_doc_and_get_name("Delivery Challan");
						frappe.set_route("Form", "Delivery Challan", newDoc);
						frappe.model.set_value(
							"Delivery Challan",
							newDoc,
							"delivery_location",
							frm.doc.name
						);
						frappe.model.set_value(
							"Delivery Challan",
							newDoc,
							"print_order",
							frm.doc.print_order
						);
					});
				} else {
					frm.add_custom_button("See Delivery Challan", () =>
						frappe.set_route("Form", "Delivery Challan", docs[0].name)
					);
				}
			});
	},
	async before_save(frm) {
		if (frm.doc.qty <= 0) {
			frappe.throw("Invalid quantity - it should be more than zero.");
		}
		// Redirect to PO if this is a new DL (to facilitate easy addition)
		if (frm.doc.__islocal) {
			this.redirect = true;
		}

		const locs = await frappe.db.get_list("Annexure Delivery Location", {
			filters: { print_order: frm.doc.print_order, name: ["!=", frm.doc.name] },
			fields: ["qty", "name"],
			// Arbitrary limit to ensure bug-less ness
			limit: 100000,
		});

		const print_order_qty = (
			await frappe.db.get_value("Print Order", frm.doc.print_order, "qty")
		).message.qty;
		const unassigned = print_order_qty - locs.reduce((a, b) => a + b.qty, 0) - frm.doc.qty;

		if (unassigned < 0) {
			frappe.throw("There are not enough copies available in this Print Order");
		} else {
			await frappe.db.set_value(
				"Print Order",
				frm.doc.print_order,
				"unassigned",
				unassigned
			);
		}
	},

	async after_save(frm) {
		if (this.redirect) frappe.set_route("Form", "Print Order", frm.doc.print_order);
	},
});
