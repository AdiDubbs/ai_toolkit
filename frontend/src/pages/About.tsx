import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const About: React.FC = () => {
  return (
    <>
      <Card className="w-full bg-white/65 backdrop-blur-md border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Every About Counts. Every Donor Matters.
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
};

export default About;
