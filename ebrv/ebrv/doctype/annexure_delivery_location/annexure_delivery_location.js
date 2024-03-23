// Copyright (c) 2024, Safwan Samsudeen and contributors
// For license information, please see license.txt

frappe.ui.form.on("Annexure Delivery Location", {
	after_save(frm) {
		frappe.set_route("Form", "Print Order", frm.doc.print_order);
	},
});
