import 'package:flutter/material.dart';
import 'package:pin_entry_text_field/pin_entry_text_field.dart';
import 'package:healthcare_app/utils/index.dart';

class Body extends StatelessWidget {
  Future<dynamic> fetchToken() async {
    final response = await HttpClient.get(path: '/healthcare-token/${30}');
    return response;
  }

  _sendPin(String pin) async {
    print(pin);
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchToken(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final token = snapshot.data;
                return Column(
                  children: [
                    Container(
                        margin: EdgeInsets.all(20),
                        padding: EdgeInsets.all(20),
                        child: Column(
                          children: [
                            Table(
                              children: [
                                TableRow(children: [
                                  Text('Name',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text("123")
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('Description',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text("description")
                                ]),
                              ],
                            ),
                          ],
                        ),
                        width: double.infinity,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: Colors.white,
                            border: Border.all(
                              color: Colors.grey,
                              style: BorderStyle.solid,
                              width: 1,
                            ))),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: PinEntryTextField(
                        fields: 6,
                        isTextObscure: true,
                        showFieldAsBox: true,
                        onSubmit: _sendPin,
                      ),
                    ),
                  ],
                );
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}
