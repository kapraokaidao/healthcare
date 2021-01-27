import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:pin_entry_text_field/pin_entry_text_field.dart';
import 'package:healthcare_app/utils/index.dart';

class Body extends StatelessWidget {
  final dynamic redeemRequest;

  Body(this.redeemRequest);

  Future<dynamic> fetchToken() async {
    final serviceId = this.redeemRequest["healthcareToken"]["id"];
    final response =
        await HttpClient.get(path: '/healthcare-token/balance/${serviceId}');
    return response;
  }

  _sendPin(context, String pin) async {
    print(pin);
    final numericRegex = RegExp(r'^\d{1,6}$');
    final serviceId = this.redeemRequest["healthcareToken"]["id"];
    if (numericRegex.hasMatch(pin)) {
      final response = await HttpClient.post('/healthcare-token/redeem',
          {"serviceId": serviceId.toString(), "pin": pin.toString()});
      print(response);
      if (response.containsKey("statusCode") && response["statusCode"] != 200) {
        return showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: Text('Error'),
                content: Text(response["message"]),
              );
            });
      } else {
        Navigator.push(context, TokenScreen.route());
      }
    }
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
                final balance = snapshot.data;
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
                                  Text(balance["healthcareToken"]["name"])
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('Description',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(
                                      balance["healthcareToken"]["description"])
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('Balance',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(balance["balance"].toString())
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('Requested Amount',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(redeemRequest['amount'].toString())
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
                        onSubmit: (pin) {
                          _sendPin(context, pin);
                        },
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
