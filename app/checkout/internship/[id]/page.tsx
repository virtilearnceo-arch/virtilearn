/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckoutInternshipClient from "../checkoutInternshipClient";
import { getUser } from "@/lib/supabase/getUser";

export default async function CheckoutInternshipPage(props: any) {
    const params = await props.params; // ✅ await params
    const internshipId = params?.id ?? null;


    const user = await getUser();

    return (
        <CheckoutInternshipClient
            internshipId={internshipId}
            userId={user?.id ?? null}
        />
    );
}
