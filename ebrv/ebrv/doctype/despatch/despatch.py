# Copyright (c) 2024, Safwan Samsudeen and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Despatch(Document):
    def on_update(self):
        if self.name != self.despatch_id and not self.is_new():
            frappe.rename_doc(self.doctype, self.name, str(self.despatch_id))
