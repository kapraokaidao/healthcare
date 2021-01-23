import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/agreement/agreement_screen.dart';
import 'package:healthcare_app/screens/login/login_screen.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(100),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              children: [
                Text('Welcome to'),
                Text('Healthcare Token'),
              ],
            ),
            Column(children: [
              OutlineButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => AgreementScreen()),
                  );
                },
                child: Text('Register'),
              ),
              OutlineButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                  );
                },
                child: Text('Login'),
              )
            ])
          ],
        ),
      ),
    );
  }
}
