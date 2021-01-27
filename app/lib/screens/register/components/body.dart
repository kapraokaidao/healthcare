import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/kyc/kyc_screen.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(40),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              'Register',
              style: TextStyle(fontSize: 40),
            ),
            Container(
              child: Column(
                children: [
                  Row(
                    children: [
                      Text('First Name'),
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.only(left: 10),
                          child: TextField(
                            decoration: const InputDecoration(
                                hintText: 'Enter a search term'),
                          ),
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
            OutlineButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => KYCScreen()),
                );
              },
              child: Text('Next'),
            )
          ],
        ),
      ),
    );
  }
}
