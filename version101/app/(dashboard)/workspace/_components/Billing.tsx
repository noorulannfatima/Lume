"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Download } from "lucide-react";

interface BillingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Mockup billing data
const MOCKUP_DATA = {
    subscription: {
        plan: "Pro Plan",
        status: "Active",
        price: "$29/month",
        renewalDate: "December 25, 2025",
        features: [
            "Unlimited workspaces",  
            "Unlimited channels",
            "Advanced analytics",
            "Priority support",
            "Custom integrations"
        ]
    },
    paymentMethod: {
        type: "Visa",
        last4: "4242",
        expiryDate: "12/2026"
    },
    billingHistory: [
        {
            id: "inv_001",
            date: "Nov 25, 2025",
            description: "Pro Plan - Monthly",
            amount: "$29.00",
            status: "Paid"
        },
        {
            id: "inv_002",
            date: "Oct 25, 2025",
            description: "Pro Plan - Monthly",
            amount: "$29.00",
            status: "Paid"
        },
        {
            id: "inv_003",
            date: "Sep 25, 2025",
            description: "Pro Plan - Monthly",
            amount: "$29.00",
            status: "Paid"
        },
        {
            id: "inv_004",
            date: "Aug 25, 2025",
            description: "Pro Plan - Monthly",
            amount: "$29.00",
            status: "Paid"
        }
    ]
};

export function Billing({ open, onOpenChange }: BillingProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Billing & Subscription</DialogTitle>
                    <DialogDescription>
                        Manage your subscription, payment methods, and billing history.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Plan Card */}
                    <Card>
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{MOCKUP_DATA.subscription.plan}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {MOCKUP_DATA.subscription.price} • Renews on {MOCKUP_DATA.subscription.renewalDate}
                                    </CardDescription>
                                </div>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-600 border-green-500/20">
                                    {MOCKUP_DATA.subscription.status}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Plan includes:</p>
                                <ul className="space-y-2">
                                    {MOCKUP_DATA.subscription.features.map((feature, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Button variant="outline" size="sm">
                                    Change Plan
                                </Button>
                                <Button variant="outline" size="sm">
                                    Cancel Subscription
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method Card */}
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>
                                Manage your payment methods
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-10 rounded-lg border bg-muted">
                                        <CreditCard className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {MOCKUP_DATA.paymentMethod.type} ending in {MOCKUP_DATA.paymentMethod.last4}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Expires {MOCKUP_DATA.paymentMethod.expiryDate}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Update
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing History Card */}
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Billing History</CardTitle>
                            <CardDescription>
                                View and download your invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {MOCKUP_DATA.billingHistory.map((invoice) => (
                                    <div 
                                        key={invoice.id} 
                                        className="flex items-center justify-between py-3 border-b last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{invoice.description}</p>
                                            <p className="text-xs text-muted-foreground">{invoice.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium">{invoice.amount}</span>
                                            <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-green-500/10 text-green-600 border-green-500/20">
                                                {invoice.status}
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <Download className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
